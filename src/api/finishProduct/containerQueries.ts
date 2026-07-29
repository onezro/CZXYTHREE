import request from "@/request/baseDataRequst";
export function QueryPackingData(data:any) {
  return request({
    url: "/api/ReportQuery/QueryPackingData",
    method: "post",
    data,
  });
}