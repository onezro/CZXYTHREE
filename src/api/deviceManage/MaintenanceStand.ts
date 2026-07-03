import request from "@/request/deviceRequest";
//查询所有保养标准
export function GetAllMaintenanceStands(data: any) {
  return request({
    url: "/api/DeviceManager/GetAllMaintenanceStands",
    method: "GET",
    data,
  });
}
//新增或更新保养标准
export function AddOrUpdateMaintenanceStands(data: any) {
  return request({
    url: "/api/DeviceManager/AddOrUpdateMaintenanceStands",
    method: "post",
    data,
  });
}
//根据ID查询保养标准详情
export function GetMaintenanceStandInfoById(data: any) {
  return request({
    url: "/api/DeviceManager/GetMaintenanceStandInfoById",
    method: "GET",
    params: data,
  });
}

//删除保养标准
export function DeleteMaintenanceStands(data: any) {
  return request({
    url: "/api/DeviceManager/DeleteMaintenanceStands",
    method: "post",
    data,
  });
}
//查询保养项目
export function GetAllMaintenanceItems(data: any) {
  return request({
    url: "/api/DeviceManager/GetAllMaintenanceItems",
    method: "GET",
    params: data,
  });
}
