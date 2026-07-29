import request from "@/request/baseDataRequst";
//入库检验查询
export function QueryWarehouseInspectionData(data:any) {
  return request({
    url: "/api/ReportQuery/QueryWarehouseInspectionData",
    method: "post",
    data,
  });
}