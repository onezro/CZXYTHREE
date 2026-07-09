import request from "@/request/smtApplyRequest";
//对比详情
export function GetCompareDetailPage(data: any) {
    return request({
        url: "/api/IctPassCompareReport/GetCompareDetailPage",
        method: "post",
        data
    })
}
//未AOI但ICT通过
export function GetNotAoiButIctOkPage(data: any) {
    return request({
        url: "/api/IctPassCompareReport/GetNotAoiButIctOkPage",
        method: "post",
        data
    })
}
//汇总
export function GetSummaryStatistics(data: any) {
    return request({
        url: "/api/IctPassCompareReport/GetSummaryStatistics",
        method: "post",
        data
    })
}
