import request from "@/request/deviceRequest";

//查询异常记录列表
export function QueryExceptionRecordList(data: any) {
  return request({
    url: `/api/esd/QueryExceptionRecordList`,
    method: "post",
    data
  });
}

//处理异常记录
export function RectifyExceptionRecord(data: any) {
  return request({
    url: `/api/esd/RectifyExceptionRecord`,
    method: "post",
    data
  });
}
//重新检查异常记录
export function RecheckExceptionRecord(data: any) {
  return request({
    url: `/api/esd/RecheckExceptionRecord`,
    method: "post",
    data
  });
}
