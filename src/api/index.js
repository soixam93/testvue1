/*
  @author: LEE
  @file: index.js
  @create: 2023-07-27 17:29:42
  @last-modifier: LEE
  @last-modify: 2023-07-27 17:29:42
*/

import axios from "axios";

const baseUrl = "https://apilist.tronscanapi.com/api";
const apiKey = "5995aaa9-dae7-482f-bae9-02bc09e90d55";

// create an axios instance
const service = axios.create({
    baseURL: baseUrl,
    timeout: 600000,
});

// request interceptor
service.interceptors.request.use(
    (config) => {
        config.headers["TRON-PRO-API-KEY"] = apiKey;
        return config;
    },
    (error) => {
        // do something with request error
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    (response) => {
        const res = response.data;

        if (!res.code) {
            return response;
        }

        if (res.code === 200) {
            return res;
        } else {
            return Promise.reject(response);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default service;
