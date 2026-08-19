import request from "@/request/deviceRequest"

// ==================== 工治具类型（ToolsMold）====================
//查询工治具类型
export function queryToolsMold(data:any) {
  return request({
    url: "/api/Repair/ToolsMold/Query",
    method: "post",
    data
  });
}
//新增工治具类型
export function insertToolsMold(data:any) {
  return request({
    url: "/api/Repair/ToolsMold/Insert",
    method: "post",
    data
  });
}
//更新工治具类型
export function updateToolsMold(data:any) {
  return request({
    url: "/api/Repair/ToolsMold/Update",
    method: "post",
    data
  });
}
//删除工治具类型
export function deleteToolsMold(data:any) {
  return request({
    url: "/api/Repair/ToolsMold/Delete",
    method: "post",
    data
  });
}

// ==================== 工治具台账（ToolsID）====================
//查询工治具台账
export function queryToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Query",
    method: "post",
    data
  });
}
//查询工治具资产
export function queryAssetToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/QueryAsset",
    method: "post",
    data
  });
}
//新增工治具台账
export function insertToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Insert",
    method: "post",
    data,
  });
}
//更新工治具台账
export function updateToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Update",
    method: "post",
    data,
  });
}
//删除工治具台账
export function deleteToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Delete",
    method: "post",
    data,
  });
}
//报废工治具台账
export function scrapToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Scrap",
    method: "post",
    data,
  });
}

// ==================== 工治具领用单（ToolsOrder）====================
//查询工治具领用单
export function queryToolsOrder(data:any) {
  return request({
    url: "/api/Repair/ToolsOrder/Query",
    method: "post",
    data
  });
}

// ==================== 产品消耗（ToolsSpec）====================
//查询产品消耗
export function queryToolsSpec(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Query",
    method: "post",
    data
  });
}
//新增产品消耗
export function insertToolsSpec(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Insert",
    method: "post",
    data,
  });
}
//更新产品消耗
export function updateToolsSpec(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Update",
    method: "post",
    data,
  });
}
//删除产品消耗
export function deleteToolsSpec(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Delete",
    method: "post",
    data,
  });
}
//导入产品消耗
export function importToolsSpec(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Import",
    method: "post",
    data,
  });
}
