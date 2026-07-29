import request from "@/request/smtSet/smtSetReuqest";

export function XY_Prod_AddMissSN(data:any) {
  return request({
    url: "/XingYuAPI/XY_Prod_AddMissSN",
    method: "post",
    data
  });
}