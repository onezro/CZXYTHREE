import request from "@/request/MSD/noindex";
import request1 from "@/request/MSD/index";

export function dryComponentControl(data:any) {
  return request({
    url: "/XingYuAPI/DryComponentControl",
    method: "post",
    data,
  });
}

export function QueryProductMSDData(data:any) {
    return request1({
        url: "/api/ProductMSD/QueryProductMSDData",
        method: "post",
        data,
    });
}