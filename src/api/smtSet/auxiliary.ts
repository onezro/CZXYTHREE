import request from "@/request/smtSet/smtSetReuqest";

export function getProduct(data:any) {
  return request({
    url: "/XingYuAPI/XY_CO_ProductControl",
    method: "post",
    data,
  });
}

export function getProductDetail(data:any) {
  return request({
    url: "/XingYuAPI/XY_CO_Product_CControl",
    method: "post",
    data,
  });
}
export function insetProductData(data:any) {
  return request({
    url: "/XingYuAPI/XY_CO_Product_CControl",
    method: "post",
    data,
  });
}