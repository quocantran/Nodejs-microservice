"use strict";

import mongoose from "mongoose";

// Singleton class
class Database {
  private static instance: Database;
  constructor() {
    this.connect();
  }

  connect(type: string = "mongodb") {
    mongoose
      .connect(
        "mongodb+srv://quocan142536:Ta123456@cluster0.emuywiy.mongodb.net/nestjs-basic?retryWrites=true&w=majority",
        {
          maxPoolSize: 50,
        }
      )
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
