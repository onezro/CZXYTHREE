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
