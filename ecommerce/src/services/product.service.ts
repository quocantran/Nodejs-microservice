"use strict";

import mongoose, { Schema } from "mongoose";
import { BadRequestError } from "../core/error.response";
import { IDecoded, IProduct, Inventory } from "../interfaces/index";
import { ClothingModel, ProductModel } from "../models/product.model";
import parse from "api-query-params";
import { insertInventory } from "../models/repositories/inventory.repo";
import {
  cachedProductData,
  deleteAllKeyProduct,
  setData,
} from "./redis.service";
import NotificationService from "./notification.service";
interface IProductClass {
  createProduct(userId: string): Promise<any>;
  updateProduct(productId: mongoose.Types.ObjectId): Promise<any>;
}

type ProductConstructor = new (productData: IProduct) => IProductClass;

class ProductFactory {
  static productRegistry: { [key: string]: ProductConstructor } = {};

  static registerProductType(type: string, classRef: ProductConstructor) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type: string, payload: IProduct, user: IDecoded) {
    payload.product_shop = user.userId;
    const classRef = this.productRegistry[type];
    if (!classRef) {
      throw new BadRequestError("Invalid product type");
    }

    const productInstance = new classRef(payload);
    return await productInstance.createProduct(user.userId.toString());
  }

  static async getProductsPaginated(qs: any) {
    const redisKey = `product_${JSON.stringify(qs)}`;
    const cachedData = await cachedProductData(redisKey);
    if (cachedData) {
      return cachedData;
    }
    const { filter, sort, population } = parse(qs);
    delete filter.current;
    delete filter.pageSize;
    const totalRecord = (await ProductModel.find(filter)).length;
    const limit = qs.pageSize ? parseInt(qs.pageSize) : 10;
    const totalPage = Math.ceil(totalRecord / limit);
    const skip = (qs.current - 1) * limit;
    const current = +qs.current ? +qs.current : 1;

    const products = await ProductModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort((sort as any) || { updatedAt: -1 })
      .populate(population)
      .lean()
      .exec();
    const response = {
      meta: {
        current: current,
        pageSize: limit,
        pages: totalPage,
        total: totalRecord,
      },
      result: products,
    };
    await setData(redisKey, response);
    return response;
  }

  static async searchProduct(search: string) {
    const regexSearch = new RegExp(search);
    const products = await ProductModel.find(
      {
        $text: { $search: regexSearch as unknown as string },
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    return products;
  }

  static async updateProduct(
    productId: mongoose.Types.ObjectId,
    payload: IProduct,
    user: IDecoded
  ) {
    if (user.userId !== payload.product_shop._id) {
      throw new BadRequestError("You are not allowed to update this product");
    }
    const classRef = this.productRegistry[payload.product_category];
    if (!classRef) {
      throw new BadRequestError("Invalid product type");
    }
    return await new classRef(payload).updateProduct(productId);
  }
}

class Product {
  public product_name: string;
  public product_price: number;
  public product_description: string;
  public product_thumb: string;
  public product_quantity: number;
  public product_category: string;
  public product_attributes: Schema.Types.Mixed;
  public product_shop: mongoose.Types.ObjectId;

  constructor({
    product_name,
    product_price,
    product_description,
    product_thumb,
    product_quantity,
    product_category,
    product_attributes,
    product_shop,
  }: IProduct) {
    this.product_name = product_name;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_thumb = product_thumb;
    this.product_quantity = product_quantity;
    this.product_category = product_category;
    this.product_attributes = product_attributes;
    this.product_shop = product_shop;
  }

  //create product
  async createProduct(userId: string, productId: mongoose.Types.ObjectId) {
    await deleteAllKeyProduct();
    const newProduct = await ProductModel.create({
      ...this,
      _id: productId,
    });
    if (newProduct) {
      const inventory: Inventory = {
        inven_productId: newProduct._id,
        inven_shopId: this.product_shop,
        inven_stock: this.product_quantity,
        inven_location: "default",
      };
      await insertInventory(inventory);
      NotificationService.pushNotiToSystem({
        type: "SHOP_001",
        receivedId: 1,
        senderId: this.product_shop.toString(),
        options: {
          product_name: this.product_name,
          product_shop: this.product_shop,
        },
      })
      .catch((err) => console.log(err));
    }
    return newProduct;
  }

  //update product
  async updateProduct(productId: mongoose.Types.ObjectId) {
    await deleteAllKeyProduct();
    return await ProductModel.updateOne(
      {
        _id: productId,
      },
      {
        ...this,
      }
    );
  }
}

class Clothing extends Product {
  async createProduct(userId: string) {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Create clothing failed");
    }
    const newProduct = await super.createProduct(userId, newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Create product failed");
    }
    return newProduct;
  }

  async updateProduct(productId: mongoose.Types.ObjectId) {
    if (this.product_attributes) {
      const updateClothing = await ClothingModel.updateOne(
        {
          _id: productId,
          ...this.product_attributes,
        },
        {
          new: true,
        }
      );

      if (!updateClothing) {
        throw new BadRequestError("Update clothing failed");
      }
    }

    const updateProduct = await super.updateProduct(productId);
    if (!updateProduct) {
      throw new BadRequestError("Update product failed");
    }
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct(userId: string) {
    const attributes = this.product_attributes;

    const newElectronics = await ClothingModel.create(attributes);

    if (!newElectronics) {
      throw new BadRequestError("Create clothing failed");
    }
    const newProduct = await super.createProduct(userId, newElectronics._id);
    if (!newProduct) {
      throw new BadRequestError("Create product failed");
    }
    return newProduct;
  }
}

// Register product types

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);

export default ProductFactory;
