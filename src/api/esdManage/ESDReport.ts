import request from "@/request/deviceRequest";

export function QueryCheckRecordReport(data: any) {
  return request({
    url: `/api/esd/QueryCheckRecordReport`,
    method: "post",
    data
  });
}

export function QueryCheckRecordTypeSummary(data: any) {
  return request({
    url: `/api/esd/QueryCheckRecordTypeSummary`,
    method: "post",
    data
  });
}

export function QueryCheckRecordStatistics(data: any) {
  return request({
    url: `/api/esd/QueryCheckRecordStatistics`,
    method: "post",
    data
  });
}