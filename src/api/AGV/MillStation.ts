import request from "@/request/deviceRequest";

//查询所有点名
export function QueryPointNames(data: any) {
  return request({
    url: `/api/mes/agv/PointNames`,
    method: "post",
    data,
  });
}



//新增/更新点信息
export function InsertUpdatePointInfo(data: any) {
  return request({
    url: `/api/mes/agv/InsertUpdatePointInfo`,
    method: "post",
    data,
  });
}

//软删除点信息
export function SoftDeletePointInfo(data: any) {
  return request({
    url: `/api/mes/agv/SoftDeletePointInfo`,
    method: "post",
    data,
  });
}

//根据ID查询点信息
export function GetPointInfoByID(data: any) {
  return request({
    url: `/api/mes/agv/GetPointInfoByID`,
    method: "post",
    data,
  });
}
