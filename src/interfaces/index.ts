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
