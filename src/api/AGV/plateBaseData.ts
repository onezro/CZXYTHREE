import request from "@/request/deviceRequest";
import smtApplyRequest from "@/request/smtApplyRequest";

// 新增上下板机基础数据
export function AddPlateBaseData(data: any) {
  return request({
    url: "/api/AGVPlateBaseData/Add",
    method: "post",
    data,
  });
}

// 修改上下板机基础数据（复合条件：agvmcid_no + agvmcid_Point + agvmcid_Address）
export function UpdatePlateBaseData(data: any) {
  return request({
    url: "/api/AGVPlateBaseData/Update",
    method: "post",
    data,
  });
}

// 修改上下板机基础数据状态（复合条件：agvmcid_no + agvmcid_Point + agvmcid_Address）
export function UpdatePlateBaseDataStatus(data: any) {
  return request({
    url: "/api/AGVPlateBaseData/UpdateStatus",
    method: "post",
    data,
  });
}

// 删除上下板机基础数据
export function DeletePlateBaseData(data: any) {
  return request({
    url: "/api/AGVPlateBaseData/Delete",
    method: "post",
    data,
  });
}

// 查询上下板机基础数据列表
export function QueryPlateBaseData(data: any) {
  return request({
    url: "/api/AGVPlateBaseData/Query",
    method: "post",
    data,
  });
}

// 获取设备下拉数据
export function GetEquipment(data: any = {}) {
  return request({
    url: "/api/AGVPlateBaseData/GetEquipment",
    method: "post",
    data,
  });
}

// 获取点位下拉数据
export function GetPoint(data: any = {}) {
  return request({
    url: "/api/AGVPlateBaseData/GetPoint",
    method: "post",
    data,
  });
}

// 获取产线下拉数据
export function GetAllValorLine(data: any = {}) {
  return smtApplyRequest({
    url: "/api/ChangeOver/GetAllValorLine",
    method: "post",
    data,
  });
}
