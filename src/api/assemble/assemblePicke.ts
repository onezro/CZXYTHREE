import request from "@/request/baseDataRequst/index";
//拣货单
export function getChkOutShtPage(data: any) {
  return request({
    url: "/api/ChkOutSht/GetChkOutShtPage",
    method: "post",
    data
  });
}
//配料详细
export function getChkOutShtItemDetail(data: any) {
  return request({
    url: "/api/ChkOutSht/GetChkOutShtItemDetail",
    method: "post",
    data
  });
}

export function getChkOutShtListDetail(data: any) {
  return request({
    url: "/api/ChkOutSht/GetChkOutShtListDetail",
    method: "post",
    data
  });
}

//计算锁定
export function batching(data: any) {
  return request({
    url: "/api/ChkOutSht/Batching",
    method: "post",
    data
  });
}
