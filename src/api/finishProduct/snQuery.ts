import request from "@/request/baseDataRequst";
export function QueryPCBBoardData(data:any) {
  return request({
    url: "/api/ReportQuery/QueryPCBBoardData",
    method: "post",
    data,
  });
}