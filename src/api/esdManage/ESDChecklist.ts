import request from "@/request/deviceRequest";
//查询ESD对象列表
export function QueryCheckFormList(data: any) {
  return request({
    url: `/api/esd/QueryCheckFormList`,
    method: "get",
    params: data,
  });
}

//查询ESD对象明细
export function QueryCheckFormDetail(data: any) {
  return request({
    url: `/api/esd/QueryCheckFormDetail`,
    method: "get",
    params: data,
  });
}
export function AddCheckForm(data: any) {
  return request({
    url: `/api/esd/AddCheckForm`,
    method: "post",
    data,
  });
}

//更新ESD对象
export function UpdateCheckForm(data: any) {
  return request({
    url: `/api/esd/UpdateCheckForm`,
    method: "post",
    data,
  });
}

//删除ESD对象
export function DeleteCheckForm(data: any) {
  return request({
    url: `/api/esd/DeleteCheckForm`,
    method: "delete",
     params: data,
  });
}
