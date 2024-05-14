import mongoose from "mongoose";

export interface IShop {
  name: string;
  email: string;
  password: string;
}

export interface IApiKey {
  key: string;
  status: string;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IKeyStore {
  _id: mongoose.Types.ObjectId;
  userId?: string;
  publicKey: any;
  refreshToken: string;
}

export interface IDecoded {
  userId: string;
  email: string;
}
