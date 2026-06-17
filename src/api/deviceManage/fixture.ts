import request from "@/request/deviceRequest"

//查询工具模具
export function queryToolsMold(data:any) {
  return request({
    url: "/api/Repair/ToolsMold/Query",
    method: "post",
    data
  });
}
//新增工具模具
export function insertToolsMold(data:any) {
  return request({
    url: "/api/Repair/ToolsMold/Insert",
    method: "post",
    data
  });
}
//更新工具模具
export function updateToolsMold(data:any) {
  return request({
    url: "/api/Repair/ToolsMold/Update",
    method: "post",
    data
  });
}
//删除工具模具
export function deleteToolsMold(data:any) {
  return request({
    url: "/api/Repair/ToolsMold/Delete",
    method: "post",
    data
  });
}

//
export function moldControl(data:any) {
  return request({
    url: "/XingYuAPI/XY_WMS_Tools_MoldControl",
    method: "post",
    data,
  });
}
//查询工具ID
export function queryToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Query",
    method: "post",
    data
  });
}
//新增工具ID
export function insertToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Insert",
    method: "post",
    data,
  });
}
//更新工具ID
export function updateToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Update",
    method: "post",
    data,
  });
}
//删除工具ID
export function deleteToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Delete",
    method: "post",
    data,
  });
}

//报废工具ID
export function scrapToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/Scrap",
    method: "post",
    data,
  });
}

 export function QueryAssetToolsID(data:any) {
  return request({
    url: "/api/Repair/ToolsID/QueryAsset",
    method: "post",
    data
  });
 }


//查询工具领用单
export function queryToolsOrder(data:any) {
  return request({
    url: "/api/Repair/ToolsOrder/Query",
    method: "post",
    data
  });
}

//新增工具领用单
export function insertToolsSpec(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Insert",
    method: "post",
    data,
  });
}

//更新工具领用单
export function updateToolsSpec(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Update",
    method: "post",
    data,
  });
}
//删除工具领用单
export function deleteToolsSpec(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Delete",
    method: "post",
    data,
  });
} 
//查询工具领用单详情
export function queryToolsSpec(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Query",
    method: "post",
    data
  });
}
//工具领用单导入控制
export function specImportControl(data:any) {
  return request({
    url: "/api/Repair/ToolsSpec/Import",
    method: "post",
    data,
  });
}

// export function orderControl (data:any) {
//   return request({
//     url: "/XingYuAPI/XY_WMS_Tools_IDControl",
//     method: "post",
//     data,
//   });
// }
