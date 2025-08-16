const { default: axios } = require("axios");

// export const BASE_URL =  "https://concretion.onrender.com";
export const BASE_URL = "http://localhost:5500"


export const clientServer = axios.create({
  baseURL: BASE_URL,
});
