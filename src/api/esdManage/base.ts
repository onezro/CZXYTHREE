import request from "@/request/deviceRequest";
//查询ESD对象列表
export function QueryEsdObjectList(data: any) {
  return request({
    url: `/api/esd/QueryEsdObjectList`,
    method: "get",
    params: data,
  });
}
//新增ESD对象
export function AddEsdObject(data: any) {
  return request({
    url: `/api/esd/AddEsdObject`,
    method: "post",
    data,
  });
}
//更新ESD对象
export function UpdateEsdObject(data: any) {
  return request({
    url: `/api/esd/UpdateEsdObject`,
    method: "post",
    data,
  });
}
//删除ESD对象
export function DeleteEsdObject(data: any) {
  return request({
    url: `/api/esd/DeleteEsdObject`,
    method: "DELETE",
    params: data,
  });
}
//查询检查内容列表
export function QueryCheckContentList(data: any) {
  return request({
    url: `/api/esd/QueryCheckContentList`,
    method: "get",
    params: data,
  });
}
//新增检查内容
export function AddCheckContent(data: any) {
  return request({
    url: `/api/esd/AddCheckContent`,
    method: "post",
    data,
  });
}
//更新检查内容
export function UpdateCheckContent(data: any) {
  return request({
    url: `/api/esd/UpdateCheckContent`,
    method: "post",
    data,
  });
}
//删除检查内容
export function DeleteCheckContent(data: any) {
  return request({
    url: '/api/esd/DeleteCheckContent',
    method: "DELETE",
    params: data,
  });
}
export function QueryMeasureDeviceList(data: any) {
  return request({
    url: `/api/esd/QueryMeasureDeviceList`,
    method: "get",
    params: data,
  });
}
export function AddMeasureDevice(data: any) {
  return request({
    url: `/api/esd/AddMeasureDevice`,
    method: "post",
    data,
  });
}
export function UpdateMeasureDevice(data: any) {
  return request({
    url: `/api/esd/UpdateMeasureDevice`,
    method: "post",
    data,
  });
}
//删除检查内容
export function DeleteMeasureDevice(data: any) {
  return request({
    url: '/api/esd/DeleteMeasureDevice',
    method: "DELETE",
    params: data,
  });
}

export function QueryCheckFrequencyList(data: any) {
  return request({
    url: `/api/esd/QueryCheckFrequencyList`,
    method: "get",
    params: data,
  });
}
export function AddCheckFrequency(data: any) {
  return request({
    url: `/api/esd/AddCheckFrequency`,
    method: "post",
    data,
  });
}
export function UpdateCheckFrequency(data: any) {
  return request({
    url: `/api/esd/UpdateCheckFrequency`,
    method: "post",
    data,
  });
}
//删除检查内容
export function DeleteCheckFrequency(data: any) {
  return request({
    url: '/api/esd/DeleteCheckFrequency',
    method: "DELETE",
    params: data,
  });
}
