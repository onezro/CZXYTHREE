import request from "@/request/smtApplyRequest";


//获取线体
export function getapsline(data:any) {
    return request({
        url: "/api/aps/schedule/getapsline",
        method: "post",
        data
    });
}
//同步
export function wotoaps(data:any) {
    return request({
        url: "/api/aps/schedule/wotoaps",
        method: "post",
        data
    });
}
//计划排程
export function apsschedule(data:any) {
    return request({
        url: "/api/aps/schedule/apsschedule",
        method: "post",
        data
    });
}
//查询排程
export function queryapsschedule(data:any) {
    return request({
        url: "/api/aps/schedule/queryapsschedule",
        method: "post",
        data
    });
}
//
export function QueryWorkOrderList(data:any) {
    return request({
        url: "/api/MaterialPreparation/QueryWorkOrderList",
        method: "get",
        params:data
    });
}
export function QueryMaterialPreparationList(data:any) {
    return request({
        url: "/api/MaterialPreparation/QueryMaterialPreparationList",
        method: "get",
        params:data
    });
}
export function QueryMaterialRequestList(data:any) {
    return request({
        url: "/api/MaterialPreparation/QueryMaterialRequestList",
        method: "get",
        params:data
    });
}
export function QueryMaterialRequestDetail(data:any) {
    return request({
        url: "/api/MaterialPreparation/QueryMaterialRequestDetail",
        method: "get",
        params:data
    });
}
export function QueryMaterialPreparationDetail(data:any) {
    return request({
        url: "/api/MaterialPreparation/QueryMaterialPreparationDetail",
        method: "get",
        params:data
    });
}
//生成备料单
export function GenerateMaterialPreparation(data:any) {
    return request({
        url: "/api/MaterialPreparation/GenerateMaterialPreparation",
        method: "post",
        data
    });
}
//产生叫料单
export function GenerateMaterialRequest(data:any) {
    return request({
        url: "/api/MaterialPreparation/GenerateMaterialRequest",
        method: "post",
        data
    });
}
//取消叫料单
export function CancelMaterialRequest(data:any) {
    return request({
        url: "/api/MaterialPreparation/CancelMaterialRequest",
        method: "post",
        data
    });
}
export function ManualSubmitSaiYiMaterialRequest(data:any) {
    return request({
        url: "/api/MaterialPreparation/ManualSubmitSaiYiMaterialRequest",
        method: "post",
        data
    });
}
//添加补料备料
export function AddSupplementMaterialPreparation(data:any) {
    return request({
        url: "/api/MaterialPreparation/AddSupplementMaterialPreparation",
        method: "post",
        data
    });
}

export function UpdateMaterialRequestStatus(data:any) {
    return request({
        url: "/api/MaterialPreparation/UpdateMaterialRequestStatus",
        method: "put",
        params:data
    });
}
