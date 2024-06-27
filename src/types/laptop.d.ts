export interface IGetLaptops {
  value: ILaptop[]
}

export interface ILaptop {
  id: string;
  cartId: string;
  laptopCode: number;
  cart: {
    name: string;
  };
}