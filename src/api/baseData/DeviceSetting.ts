import request from "@/request/deviceRequest"
// 查询设备类型
export function QueryEquipmentType(data: any) {
  return request({
    url: "/api/EquipmentProcess/QueryEquipmentType",
    method: "post",
    data,
  });
}

// 添加设备类型
export function AddEquipmentType(data: any) {
  return request({
    url: "/api/EquipmentProcess/AddEquipmentType",
    method: "post",
    data,
  });
}

// 更新设备类型
export function UpdateEquipmentType(data: any) {
  return request({
    url: "/api/EquipmentProcess/UpdateEquipmentType",
    method: "post",
    data,
  });
}

// 删除设备类型
export function DeleteEquipmentType(data: any) {
  return request({
    url: "/api/EquipmentProcess/DeleteEquipmentType",
    method: "post",
    data,
  });
}

// 查询工艺参数名
export function QueryProcessParameterName(data: any) {
  return request({
    url: "/api/EquipmentProcess/QueryProcessParameterName",
    method: "post",
    data,
  });
}

// 添加工艺参数名
export function AddProcessParameterName(data: any) {
  return request({
    url: "/api/EquipmentProcess/AddProcessParameterName",
    method: "post",
    data,
  });
}

// 更新工艺参数名
export function UpdateProcessParameterName(data: any) {
  return request({
    url: "/api/EquipmentProcess/UpdateProcessParameterName",
    method: "post",
    data,
  });
}

// 删除工艺参数名
export function DeleteProcessParameterName(data: any) {
  return request({
    url: "/api/EquipmentProcess/DeleteProcessParameterName",
    method: "post",
    data,
  });
}

// 查询设备绑定产线
export function QueryEquipmentLineBinding(data: any) {
  return request({
    url: "/api/EquipmentProcess/QueryEquipmentLineBinding",
    method: "post",
    data,
  });
}

// 新增设备绑定产线
export function AddEquipmentLineBinding(data: any) {
  return request({
    url: "/api/EquipmentProcess/AddEquipmentLineBinding",
    method: "post",
    data,
  });
}

// 更新设备绑定产线
export function UpdateEquipmentLineBinding(data: any) {
  return request({
    url: "/api/EquipmentProcess/UpdateEquipmentLineBinding",
    method: "post",
    data,
  });
}

// 删除设备绑定产线
export function DeleteEquipmentLineBinding(data: any) {
  return request({
    url: "/api/EquipmentProcess/DeleteEquipmentLineBinding",
    method: "post",
    data,
  });
}

// 查询产品绑定工艺参数
export function QueryProductProcessParameter(data: any) {
  return request({
    url: "/api/EquipmentProcess/QueryProductProcessParameter",
    method: "post",
    data,
  });
}

// 新增产品绑定工艺参数
export function AddProductProcessParameter(data: any) {
  return request({
    url: "/api/EquipmentProcess/AddProductProcessParameter",
    method: "post",
    data,
  });
}

// 更新产品绑定工艺参数
export function UpdateProductProcessParameter(data: any) {
  return request({
    url: "/api/EquipmentProcess/UpdateProductProcessParameter",
    method: "post",
    data,
  });
}

// 删除产品绑定工艺参数
export function DeleteProductProcessParameter(data: any) {
  return request({
    url: "/api/EquipmentProcess/DeleteProductProcessParameter",
    method: "post",
    data,
  });
}
