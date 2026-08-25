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

//手动提交赛意备料计划
export function ManualSubmitSaiYiMaterialRequest(data:any) {
    return request({
        url: "/api/MaterialPreparation/ManualSubmitSaiYiMaterialRequest",
        method: "post",
        data
    });
}


//手动提交赛意备料计划
export function ManualSubmitWorkOrderSupplementSaiYiMaterialRequest(data:any) {
    return request({
        url: "/api/MaterialPreparation/ManualSubmitWorkOrderSupplementSaiYiMaterialRequest",
        method: "post",
        data
    });
}


//添加补料备料
export function AddSupplementMaterialPreparation(data:any) {
    return request({
        url: "/api/MaterialPreparation/CreateWorkOrderSupplementPreparation",
        method: "post",
        data
    });
}

export function GenerateNonFirstMaterialRequest(data:any) {
    return request({
        url: "/api/MaterialPreparation/GenerateNonFirstMaterialRequest",
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

//手动生成赛意备料计划
export function ManualCreateSaiYiPreparePlan(data:any) {
    return request({
        url: "/api/MaterialPreparation/ManualCreateSaiYiPreparePlan",
        method: "post",
        data
    });
}

//查询操作日志
export function QueryOperationLog(data:any) {
    return request({
        url: "/api/APIRequestLogs/QueryPage",
        method: "post",
        data
    });
}

//查询退料调拨主表列表
export function GetProductionReturnAllocationList(data:any) {
    return request({
        url: "/api/mes/allocation/GetProductionReturnAllocationList",
        method: "post",
        data
    });
}

//查询退料调拨明细列表
export function GetProductionReturnAllocationDetailList(data:any) {
    return request({
        url: "/api/mes/allocation/GetProductionReturnAllocationDetailList",
        method: "post",
        data
    });
}

//删除退料调拨主表
export function DeleteProductionReturnAllocation(data:any) {
    return request({
        url: "/api/mes/allocation/DeleteProductionReturnAllocation",
        method: "post",
        data
    });
}

//删除退料调拨明细
export function DeleteProductionReturnAllocationDetail(data:any) {
    return request({
        url: "/api/mes/allocation/DeleteProductionReturnAllocationDetail",
        method: "post",
        data
    });
}

//重新回传生产退料
export function ResubmitProductionReturnAllocation(data:any) {
    return request({
        url: "/api/mes/allocation/ResubmitProductionReturnAllocation",
        method: "post",
        data
    });
}
