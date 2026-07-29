import request from "@/request/baseDataRequst/index";


//智驾线过程码--创建过程码
export function ExecuteAssGenerateSN(data: any) {

    return request({
        url: "/api/AssSpec/ExecuteAssGenerateSN",
        method: "post",
        data,
    });
}
//智驾线过程码--查询过程码
export function GetAssGenerateRecord(data: any) {

    return request({
        url: "/api/AssSpec/GetAssGenerateRecord",
        method: "post",
        data,
    });
}
//智驾线过程码--获取明细
export function GetAssGenerateSN(data: any) {

    return request({
        url: "/api/AssSpec/GetAssGenerateSN",
        method: "post",
        data,
    }); }
