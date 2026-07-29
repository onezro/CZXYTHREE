import request from "@/request/baseDataRequst/index";

export function queryPageContainer(data:any) {
  return request({
    url: "/api/Container/QueryPageContainer",
    method: "post",
    data,
  });
}

export function saveContainer(data:any) {
  return request({
    url: "/api/Container/SaveContainer",
    method: "post",
    data,
  });
}

export function deleteContainer(data:any) {
  return request({
    url: "/api/Container/DeleteContainer",
    method: "get",
    params: data,
  });
}

export function getHistoy(id:any) {
  return request({
    url: "/api/Half/GetHalfLog",
    method: "post",
    data: {
      PageIndex: 0,
      PageSize: 10,
      SearchText: id,
    },
  });
}

export function getReportWork(data:any) {
  return request({
    url: "/api/Half/GetReportWork",
    method: "post",
    data
  });
}

export function queryCloseOrder(data:any) {
  return request({
    url: "/api/Order/QueryCloseOrder",
    method: "post",
    data
  });
}

export function closeOrder(data:any) {
  return request({
    url: "api/Order/CloseOrder",
    method: "post",
    data
  });
}

export function GetICTOverStation(data:any) {
  return request({
    url: "/api/Half/GetICTOverStation",
    method: "post",
    data
  });
}

export function UPdateICTOverStation(data:any) {
  return request({
    url: "/api/Half/UPdateICTOverStation",
    method: "post",
    data
  });
}