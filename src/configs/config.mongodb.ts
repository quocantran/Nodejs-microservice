const dev = {
  app: {
    port: process.env.DEV_PORT,
  },
  db: {
    url: process.env.MONGODB_URL,
  },
};

const pro = {
  app: {
    port: process.env.PRO_PORT,
  },
  db: {
    url: process.env.MONGODB_URL,
  },
};

const config: { [key: string]: typeof dev | typeof pro } = { dev, pro };
const env: "dev" | "pro" = (process.env.NODE_ENV as "dev" | "pro") || "dev";
export default config[env];
