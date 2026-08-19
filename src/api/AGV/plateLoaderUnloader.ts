import request from "@/request/deviceRequest";

// 查询上下板机基础数据列表
export function QueryPlateLoaderUnloader(data: any) {
  return request({
    url: "/api/mes/agv/QueryPlateLoaderUnloader",
    method: "post",
    data,
  });
}

// 新增或更新上下板机基础数据
export function InsertUpdatePlateLoaderUnloader(data: any) {
  return request({
    url: "/api/mes/agv/InsertUpdatePlateLoaderUnloader",
    method: "post",
    data,
  });
}

// 删除上下板机基础数据
export function DeletePlateLoaderUnloader(data: any) {
  return request({
    url: "/api/mes/agv/DeletePlateLoaderUnloader",
    method: "post",
    data,
  });
}
