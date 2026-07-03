import request from "@/request/deviceRequest";

// 查询待处理任务列表
export function QueryPendingTaskList(data: any) {
  return request({
    url: `/api/esd/QueryPendingTaskList`,
    method: "get",
    params: data,
  });
}

// 查询已完成任务列表
export function QueryCompletedTaskList(data: any) {
  return request({
    url: `/api/esd/QueryCompletedTaskList`,
    method: "get",
    params: data,
  });
}

// 查询报废任务列表
export function QueryScrappedTaskList(data: any) {
  return request({
    url: `/api/esd/QueryScrappedTaskList`,
    method: "get",
    params: data,
  });
}

// 查询任务详情
export function QueryTaskDetail(data: any) {
  return request({
    url: `/api/esd/QueryTaskDetail`,
    method: "get",
    params: data,
  });
}

// 添加执行任务
export function AddExecutionTask(data: any) {
  return request({
    url: `/api/esd/AddExecutionTask`,
    method: "post",
    data,
  });
}

// 更新任务
export function UpdateTask(data: any) {
  return request({
    url: `/api/esd/UpdateTask`,
    method: "post",
    data,
  });
}
// 报废任务
export function ScrapTask(data: any) {
  return request({
    url: `/api/esd/ScrapTask`,
    method: "post",
    data,
  });
}

// 删除任务
export function DeleteTask(data: any) {
  return request({
    url: `/api/esd/DeleteTask`,
    method: "POST",
    data,
  });
}

// 查询任务周期计划列表
export function QueryTaskPlanList(data: any) {
  return request({
    url: `/api/esd/QueryTaskPlanList`,
    method: "post",
    data
  });
}

// 添加任务周期计划
export function AddTaskPlan(data: any) {
  return request({
    url: `/api/esd/AddTaskPlan`,
    method: "post",
    data,
  });
}

// 审核任务周期计划
export function AuditTaskPlan(data: any) {
  return request({
    url: `/api/esd/AuditTaskPlan`,
    method: "post",
    data,
  });
}

// 自动分配周期任务
export function AutoDispatchTask(data: any) {
  return request({
    url: `/api/esd/AutoDispatchTask`,
    method: "post",
    data,
  });
}
