import request from "@/request/smtApplyRequest";

//获取检验项
export function RefreshInspectionItem(data:any) {
    return request({
        url: "/api/iqc/RefreshInspectionItem",
        method: "get",
        params:data
    });
}
//添加检验项
export function AddInspectionItem(data:any) {
    return request({
        url: "/api/iqc/AddInspectionItem",
        method: "post",
        data
    });
}

//删除
export function DeleteInspectionItem(data:any) {
    return request({
        url: "/api/iqc/DeleteInspectionItem",
        method: "delete",
        params:data
    });
}
//---------检验项目------------//
//获取
export function RefreshInspectionProject(data:any) {
    return request({
        url: "/api/iqc/RefreshInspectionProject",
        method: "get",
        params:data
    });
}
//获取明细
export function QueryInspectionProjectDetail(data:any) {
    return request({
        url: "/api/iqc/QueryInspectionProjectDetail",
        method: "get",
        params:data
    });
}
//添加
export function AddInspectionProject(data:any) {
    return request({
        url: "/api/iqc/AddInspectionProject",
        method: "post",
        data
    });
}
//删除
export function DeleteInspectionProject(data:any) {
    return request({
        url: "/api/iqc/DeleteInspectionProject",
        method: "delete",
        params:data
    });
}
//--------检验规则---------//
//获取
export function RefreshInspectionRule(data:any) {
    return request({
        url: "/api/iqc/RefreshInspectionRule",
        method: "get",
        params:data
    });
}
//获取明细
export function QueryInspectionRuleDetail(data:any) {
    return request({
        url: "/api/iqc/QueryInspectionRuleDetail",
        method: "get",
        params:data
    });
}
//添加
export function AddInspectionRule(data:any) {
    return request({
        url: "/api/iqc/AddInspectionRule",
        method: "post",
        data
    });
}
//删除
export function DeleteInspectionRule(data:any) {
    return request({
        url: "/api/iqc/DeleteInspectionRule",
        method: "delete",
        params:data
    });
}
//模糊搜索
export function QueryPartNumbersIqc(data:any) {
    return request({
        url: "/api/iqc/QueryPartNumbers",
        method: "get",
        params:data
    });
}
//------到货单-------//
 //获取到货单
 export function QueryArrivalInspectionList(data:any) {
    return request({
        url: "/api/iqc/QueryArrivalInspectionList",
        method: "get",
        params:data
    });
}
//明细
 export function QueryArrivalInspectionDetailList(data:any) {
    return request({
        url: "/api/iqc/QueryArrivalInspectionDetailList",
        method: "get",
        params:data
    });
}
//保存
export function SaveInspectionResult(data:any) {
    return request({
        url: "/api/iqc/SaveInspectionResult",
        method: "put",
        data
    });
}
//提交

export function SubmitInspectionResult(data:any) {
    return request({
        url: "/api/iqc/SubmitInspectionResult",
        method: "put",
        data
    });
}
//检验
export function UpdateInspectionResult(data:any) {
    return request({
        url: "/api/iqc/UpdateInspectionResult",
        method: "put",
        data
    });
}
//二次确认
export function UpdateReviewResult(data:any) {
    return request({
        url: "/api/iqc/UpdateReviewResult",
        method: "put",
        data
    });
}
//查询物料
export function QueryPartNumbers(data:any) {
    return request({
        url: "/api/iqc/QueryPartNumbers",
        method: "get",
        params:data
    });
}
//-----评审-----//
 //获取
 export function QueryInspectionReviewList(data:any) {
    return request({
        url: "/api/iqc/QueryInspectionReviewList",
        method: "get",
        params:data
    });
}
 export function QueryInspectionReviewDetailList(data:any) {
    return request({
        url: "/api/iqc/QueryInspectionReviewDetailList",
        method: "get",
        params:data
    });
}

export function SaveInspectionReview(data:any) {
    return request({
        url: "/api/iqc/SaveInspectionReview",
        method: "put",
        data
    });
}