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
    url: "/XingYuAPI/XY_CO_Product_IControl",
    method: "post",
    data,
  });
}

export function insetConveyorWidth(data:any) {
  return request({
    url: "/api/ChangeOver/InsertUpdateConveyorWidth",
    method: "post",
    data,
  });
}

export function queryProductQControl(data:any) {
  return request({
    url: "/XingYuAPI/XY_CO_Product_QControl",
    method: "post",
    data,
  });
}