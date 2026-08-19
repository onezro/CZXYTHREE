
import request from "@/request/baseDataRequst/index";
  //抛料记录查询
   export function GetMaterialLossDetail(data:any) {
    return request({
      url: "/api/ReportQuery/GetMaterialLossDetail",
      method: "post",
      data
    });
  }