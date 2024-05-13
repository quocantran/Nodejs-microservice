import app from "./src/app";
import configMongodb from "./src/configs/config.mongodb";

const { server } = configMongodb;

const PORT: number = (server.port as unknown as number) || 3055;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down...");
  process.exit(1);
});
