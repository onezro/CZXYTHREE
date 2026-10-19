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
