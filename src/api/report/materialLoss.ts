import request from "@/request/baseDataRequst/index";

  //抛料记录查询
   export function GetMaterialLossData(data:any) {
    return request({
      url: "/api/ReportQuery/GetMaterialLossData",
      method: "post",
      data
    });
  }