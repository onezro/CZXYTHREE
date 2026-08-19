import request from "@/request/request";

export function QueryDictTypeTree(data: any) {
  return request({
    url: "/api/Dict/QueryDictTypeTree",
    method: "post",
    data,
  });
}

export function AddDictType(data: any) {
  return request({
    url: "/api/Dict/AddDictType",
    method: "post",
    data,
  });
}

export function UpdateDictType(data: any) {
  return request({
    url: "/api/Dict/UpdateDictType",
    method: "post",
    data,
  });
}

export function DeleteDictType(data: any) {
  return request({
    url: "/api/Dict/DeleteDictType",
    method: "post",
    data,
  });
}

export function QueryDictDataList(data: any) {
  return request({
    url: "/api/Dict/QueryDictDataList",
    method: "post",
    data,
  });
}

export function AddDictData(data: any) {
  return request({
    url: "/api/Dict/AddDictData",
    method: "post",
    data,
  });
}

export function UpdateDictData(data: any) {
  return request({
    url: "/api/Dict/UpdateDictData",
    method: "post",
    data,
  });
}

export function DeleteDictData(data: any) {
  return request({
    url: "/api/Dict/DeleteDictData",
    method: "post",
    data,
  });
}
