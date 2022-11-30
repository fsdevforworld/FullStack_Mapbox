import axios from "axios";
import { BASE_URL } from "../constant";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
});

export const getRequest = (url, params = {}) => {
  return instance({
    method: "get",
    url: url,
    params: params,
  });
};
