import request from "@/request/deviceRequest";

// 插入或更新AGV工作站
export function InsertUpdateWorkstation(data: any) {
  return request({
    url: "/api/mes/agv/InsertUpdateWorkstation",
    method: "post",
    data,
  });
}

// 删除AGV工作站
export function DeleteWorkstation(data: any) {
  return request({
    url: "/api/mes/agv/DeleteWorkstation",
    method: "post",
    data,
  });
}

// 查询AGV工作站列表
export function QueryWorkstation(data: any) {
  return request({
    url: "/api/mes/agv/QueryWorkstation",
    method: "post",
    data,
  });
}

// 查询AGV工作站详情
export function SelectWorkstation(data: any) {
  return request({
    url: "/api/mes/agv/SelectWorkstation",
    method: "post",
    data,
  });
}


// 插入或更新AGV工作站点
export function InsertUpdatePoint(data: any) {
  return request({
    url: "/api/mes/agv/InsertUpdatePoint",
    method: "post",
    data,
  });
}


// 查询AGV工作站点类型
export function GetpointType(data: any) {
  return request({
    url: "/api/mes/agv/GetpointType",
    method: "get",
    params: data,
  });
}


// 查询AGV工作站点标签
export function GetpointTag(data: any) {
  return request({
    url: "/api/mes/agv/GetpointTag",
    method: "get",
    params: data,
  });
}


// 删除AGV工作站点
export function DeletePoint(data: any) {
  return request({
    url: "/api/mes/agv/DeletePoint",
    method: "post",
    data,
  });
}

// 查询AGV工作站点列表
export function QueryPoint(data: any) {
  return request({
    url: "/api/mes/agv/QueryPoint",
    method: "post",
    data,
  });
}
// 查询AGV工作站点详情
export function SelectPoint(data: any) {
  return request({
    url: "/api/mes/agv/SelPoint",
    method: "post",
    data,
  });
}

// 插入或更新AGV工作站点表
export function InsertUpdatePointSheet(data: any) {
  return request({
    url: "/api/mes/agv/InsertUpdatePointSheet",
    method: "post",
    data,
  });
}

// 删除AGV工作站点表
export function DeletePointSheet(data: any) {
  return request({
    url: "/api/mes/agv/DeleteUpdatePointSheet",
    method: "post",
    data,
  });
}


// 查询AGV工作站点表列表
export function QueryPointSheet(data: any) {
  return request({
    url: "/api/mes/agv/QueryPointSheet",
    method: "post",
    data,
  });
}

// 新增/修改AGV点位类别
export function InsertUpdatePointType(data: any) {
  return request({
    url: "/api/mes/agv/InsertUpdatePointType",
    method: "post",
    data,
  });
}

// 删除AGV点位类别
export function DeletePointType(data: any) {
  return request({
    url: "/api/mes/agv/DeletePointType",
    method: "post",
    data,
  });
}

// 查询AGV点位类别分页
export function QueryPointType(data: any) {
  return request({
    url: "/api/mes/agv/QueryPointType",
    method: "post",
    data,
  });
}

// 新增/修改AGV点位类别表
export function InsertUpdatePointTypeSheet(data: any) {
  return request({
    url: "/api/mes/agv/InsertUpdatePointTypeSheet",
    method: "post",
    data,
  });
}

// 删除AGV点位类别表
export function DeletePointTypeSheet(data: any) {
  return request({
    url: "/api/mes/agv/DeletePointTypeSheet",
    method: "post",
    data,
  });
}

// 查询AGV点位类别表分页
export function QueryPointTypeSheet(data: any) {
  return request({
    url: "/api/mes/agv/QueryPointTypeSheet",
    method: "post",
    data,
  });
}

// 查询可用的点位类别下拉
export function GetEnablePointType(params?: any) {
  return request({
    url: "/api/mes/agv/GetEnablePointType",
    method: "get",
    params,
  });
}

export { QueryPlateLoaderUnloader, InsertUpdatePlateLoaderUnloader, DeletePlateLoaderUnloader } from './plateLoaderUnloader';

// AGV任务查询分页
export function QueryAgvTaskPage(data: any) {
  return request({
    url: "/api/AgvTask/QueryPage",
    method: "post",
    data,
  });
}

// 取消AGV任务
export function GiveAgvTask(data: any) {
  return request({
    url: "/api/AgvTask/GiveAgvTask",
    method: "post",
    data,
  });
}
