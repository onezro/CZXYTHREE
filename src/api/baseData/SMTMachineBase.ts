import request from "@/request/deviceRequest"

// 查询设备类型详情
export function GetMachineTypeById(data: any) {
  return request({
    url: "/api/MachineSetting/GetMachineTypeById",
    method: "post",
    data,
  });
}

// 新增设备型号配置
export function AddMachineType(data: any) {
  return request({
    url: "/api/MachineSetting/AddMachineType",
    method: "post",
    data,
  });
}

// 修改设备型号配置
export function UpdateMachineType(data: any) {
  return request({
    url: "/api/MachineSetting/UpdateMachineType",
    method: "post",
    data,
  });
}

// 删除设备型号配置
export function DeleteMachineType(data: any) {
  return request({
    url: "/api/MachineSetting/DeleteMachineType",
    method: "post",
    params:data
  });
}



// 根据ID查询设备设置配置
export function GetMachineSettingById(data: any) {
  return request({
    url: "/api/MachineSetting/GetMachineSettingById",
    method: "post",
    data,
  });
}



// 新增设备设置配置
export function AddMachineSetting(data: any) {
  return request({
    url: "/api/MachineSetting/AddMachineSetting",
    method: "post",
    data,
  });
}
// 修改设备设置配置
export function UpdateMachineSetting(data: any) {
  return request({
    url: "/api/MachineSetting/UpdateMachineSetting",
    method: "post",
    data,
  });
}
// 删除设备设置配置
export function DeleteMachineSetting(data: any) {
  return request({
    url: "/api/MachineSetting/DeleteMachineSetting",
    method: "post",
    params:data
  });
}
  