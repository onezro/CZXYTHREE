import request from "@/request/deviceRequest";

//新增/更新盒子类型信息
export function AddBoxType(data: any) {
  return request({
    url: "/api/Panelization/AddBoxType",
    method: "post",
    data,
  });
}
//更新盒子类型信息
export function UpdateBoxType(data: any) {
  return request({
    url: "/api/Panelization/UpdateBoxType",
    method: "post",
    data,
  });
}

//删除盒子类型信息
export function DeleteBoxType(data: any) {
  return request({
    url: "/api/Panelization/DeleteBoxType",
    method: "post",
    data,
  });
}

//查询盒子类型列表
export function QueryBoxTypeList(data: any) {
  return request({
    url: "/api/Panelization/QueryBoxTypeList",
    method: "post",
    data,
  });
}
