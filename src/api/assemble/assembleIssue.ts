import request from "@/request/baseDataRequst/index";

//领料单
export function getAssembleOrderPage(data: any) {
  return request({
    url: "/api/Order/GetAssembleOrderPage",
    method: "post",
    data
  });
}
//领料详情
export function getAssembleOrderDetail(data: any) {
  return request({
    url: "/api/Order/GetAssembleOrderDetail",
    method: "post",
    data
  });
}
//创建领料
export function saveChkOutSht(data: any) {
  return request({
    url: "/api/ChkOutSht/SaveChkOutSht",
    method: "post",
    data
  });
}