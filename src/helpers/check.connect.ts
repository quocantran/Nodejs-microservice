import mongoose from "mongoose";

// count connect

const countConnect = () => {
  const numberConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numberConnection}`);
};
