/*
  @author: LEE
  @file: transaction-info.js
  @create: 2023-07-27 18:32:08
  @last-modifier: LEE
  @last-modify: 2023-07-27 18:32:08
*/
import request from "./index.js";

export function getInfo(params) {
    return request({
        url: "/transaction-info",
        method: "get",
        params,
    });
}
