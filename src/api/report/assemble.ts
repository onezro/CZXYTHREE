import request from "@/request/reportRequest/assemble";

export function XY_Assembly_OrderStatus(data:any) {
  return request({
    url: "/XingYuAPI/XY_Assembly_OrderStatus",
    method: "post",
    data
  });
}