import request from "@/request/smtApplyRequest";

// PN编码BOM查询
export function PnCodeBomRequest(data: any) {
  return request({
    url: "/api/WorkOrderGroupMaterialIssue/PnCodeBomRequest",
    method: "post",
    data,
  });
}

// ERP BOM明细查询
export function QueryKhsapBomPage(data: any) {
  return request({
    url: "/api/WorkOrderGroupMaterialIssue/QueryKhsapBomPage",
    method: "post",
    data,
  });
}

// 料号分页查询
export function QueryPartNumbers(data: any) {
  return request({
    url: "/api/PartNumber/QueryPartNumbers",
    method: "post",
    data,
  });
}

// 新增料号
export function AddPartNumber(data: any) {
  return request({
    url: "/api/PartNumber/AddPartNumber",
    method: "post",
    data,
  });
}

// 修改料号
export function UpdatePartNumber(data: any) {
  return request({
    url: "/api/PartNumber/UpdatePartNumber",
    method: "post",
    data,
  });
}

// 删除料号
export function DeletePartNumber(data: any) {
  return request({
    url: "/api/PartNumber/DeletePartNumber",
    method: "post",
    data,
  });
}

// 查询特殊物料
export function QuerySpecialMaterial(data: any) {
  return request({
    url: "/api/mes/specialmaterial/QuerySpecialMaterial",
    method: "post",
    data,
  });
}

// 新增特殊物料
export function AddSpecialMaterial(data: any) {
  return request({
    url: "/api/mes/specialmaterial/AddSpecialMaterial",
    method: "post",
    data,
  });
}

// 修改特殊物料
export function UpdateSpecialMaterial(data: any) {
  return request({
    url: "/api/mes/specialmaterial/UpdateSpecialMaterial",
    method: "post",
    data,
  });
}

// 删除特殊物料
export function DeleteSpecialMaterial(data: any) {
  return request({
    url: "/api/mes/specialmaterial/DeleteSpecialMaterial",
    method: "post",
    data,
  });
}
