import request from "@/request/smtApplyRequest";

// 查询AGV触发日志分页
export function QueryAGVTriggerLogPage(data: any) {
  return request({
    url: "/api/APIRequestLogs/QueryAGVTriggerLogPage",
    method: "post",
    data,
  });
}
