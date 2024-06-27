import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { IGetLaptops } from "../types/laptop";

async function getLaptops(slug?: string): Promise<AxiosResponse<IGetLaptops>>{
  return (await api.get(`/cart/${slug}/laptops`));
}

const laptopRepository = {
  getLaptops
}

export default laptopRepository