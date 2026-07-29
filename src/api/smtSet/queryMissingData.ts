import request from "@/request/smtSet/smtSetReuqest";
export function XY_Prod_MissSNs(data:any) {
    return request({
      url: "/XingYuAPI/XY_Prod_MissSNs",
      method: "post",
      data
    });
  }

  export function XY_Prod_AddMissSNNew(data:any) {
    return request({
      url: "/XingYuAPI/XY_Prod_AddMissSNNew",
      method: "post",
      data
    });
  }