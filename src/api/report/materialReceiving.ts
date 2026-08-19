import request from "@/request/baseDataRequst/index";
//接料
export function GetWoOperatorTrace(data:any) {
    return request({
        url: "/api/ReportQuery/GetWoOperatorTrace",
        method: "post",
        data,
    });
}

export function GetPrintingTranslator(data:any) {
    return request({
        url: "/api/ReportQuery/GetPrintingTranslator",
        method: "post",
        data,
    });
}