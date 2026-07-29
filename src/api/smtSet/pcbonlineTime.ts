import request from "@/request/smtSet/smtSetReuqest";

export function XYL_OEE_ProductCycle(data:any) {
  return request({
    url: "/XingYuAPI/XYL_OEE_ProductCycle",
    method: "post",
    data
  });
}