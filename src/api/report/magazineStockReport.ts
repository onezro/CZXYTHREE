import request from "@/request/deviceRequest";

// 周转库库存报表查询（分页）
export function QueryMagazineStockReportPage(data: any) {
  return request({
    url: "/api/MagazineStockReport/QueryPage",
    method: "post",
    data,
  });
}

// 周转库库存报表导出（返回 Excel 文件流）
export function ExportMagazineStockReport(data: any) {
  return request({
    url: "/api/MagazineStockReport/Export",
    method: "post",
    data,
    responseType: "blob",
  });
}
