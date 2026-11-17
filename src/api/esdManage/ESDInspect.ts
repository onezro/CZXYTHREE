import request from "@/request/deviceRequest";

// 查询执行任务列表（全部 / 待执行 / 执行中）
export function QueryExecutionTaskList(data: any) {
  return request({
    url: `/api/esd/QueryExecutionTaskList`,
    method: "get",
    params: data,
  });
}

// 查询任务点检明细
export function QueryExecutionDetail(data: any) {
  return request({
    url: `/api/esd/QueryExecutionDetail`,
    method: "post",
    data,
  });
}

// 保存单条点检明细（录入检测值）
export function UpdateExecutionDetail(data: any) {
  return request({
    url: `/api/esd/UpdateExecutionDetail`,
    method: "post",
    data,
  });
}

// 提交点检
export function SubmitExecutionTask(data: any) {
  return request({
    url: `/api/esd/SubmitExecutionTask`,
    method: "post",
    data,
  });
}

// 追加明细
export function AddExecutionDetail(data: any) {
  return request({
    url: `/api/esd/AddExecutionDetail`,
    method: "post",
    data,
  });
}

// 完成任务（只有调用该接口任务才会变为已完成）
export function CompleteExecutionTask(data: any) {
  return request({
    url: `/api/esd/CompleteExecutionTask`,
    method: "post",
    data,
  });
}

// 查询车间列表
export function QueryWorkshopList() {
  return request({
    url: `/api/esd/QueryWorkshopList`,
    method: "get",
  });
}

// 查询指定车间、线体下的设备
export function QueryLineDeviceList(data: any) {
  return request({
    url: `/api/esd/QueryLineDeviceList`,
    method: "get",
    params: data,
  });
}
