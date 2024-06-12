"use strict";

import mongoose from "mongoose";
import configMongodb from "../configs/config.mongodb";

const { db } = configMongodb;

// Singleton class
class Database {
  private static instance: Database;
  constructor() {
    this.connect();
  }

  connect(type: string = "mongodb") {
    mongoose
      .connect(db.url, {
        maxPoolSize: 50,
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((error) => {
        console.error("Database connection error: ", error);
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;
