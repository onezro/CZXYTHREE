import request from '@/request/smtSet/index'

// 保存生产数据名称
export function SaveMjsID(data: any) {
  return request({
    url: `/api/Mounter/SaveMjsID`,
    method: "post",
    data,
  });
}
// 查询生产数据名称
export function QueryMjsID(data: any) {
  return request({
    url: `/api/Mounter/QueryMjsID`,
    method: "post",
    data,
  });
}
// 查询生产数据名称列表
export function GetMjsList(data: any) {
  return request({
    url: `/api/Mounter/GetMjsList`,
    method: "post",
    data,
  });
}

// 删除生产数据名称
export function DeleteMjsID(data: any) {
  return request({
    url: `/api/Mounter/DeleteMjsID`,
    method: "post",
    data,
  });
}
