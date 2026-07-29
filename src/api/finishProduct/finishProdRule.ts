import request from "@/request/baseDataRequst";

  export function addProductCodeRules(data:any) {
    return request({
      url: "/api/ProductCodeRules/addProductCodeRules",
      method: "post",
      data
    });
  }
  export function findProductCodeRules(data:any) {
    return request({
      url: "/api/ProductCodeRules/findProductCodeRules",
      method: "post",
      data
    });
  }
  export function DeleteProductCodeRules(data:any) {
    return request({
      url: "/api/ProductCodeRules/DeleteProductCodeRules",
      method: "post",
      data
    });
  }
  export function updateProductCodeRules(data:any) {
    return request({
      url: "/api/ProductCodeRules/updateProductCodeRules",
      method: "post",
      data
    });
  }