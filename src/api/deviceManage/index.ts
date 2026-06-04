import request from "@/request/deviceRequest"

//查询不良类别
export function QueryBadTypebasicInformation(data:any) {
    return request({
        url: "/api/Repair/QueryBadTypebasicInformation",
        method: "post",
       data
    });
}
//新增不良类别
export function InsertBadTypeInformation(data:any) {
    return request({
        url: "/api/Repair/InsertBadTypeInformation",
        method: "post",
       data
    });
}
//修改不良类别
export function UpdateBadTypeInformation(data:any) {
    return request({
        url: "/api/Repair/UpdateBadTypeInformation",
        method: "post",
       data
    });
}
//删除不良类别
export function DeleteBadTypeInformation(data:any) {
    return request({
        url: "/api/Repair/DeleteBadTypeInformation",
        method: "post",
       data
    });
}



//查询不良代码
export function QueryBadCodebasicInformation(data:any) {
    return request({
        url: "/api/Repair/QueryBadCodebasicInformation",
        method: "post",
       data
    });
}
//新增不良代码
export function InsertBadCodeInformation(data:any) {
    return request({
        url: "/api/Repair/InsertBadCodeInformation",
        method: "post",
       data
    });
}
//修改不良代码
export function UpdateBadCodeInformation(data:any) {
    return request({
        url: "/api/Repair/UpdateBadCodeInformation",
        method: "post",
       data
    });
}
//删除不良代码
export function DeleteBadCodeInformation(data:any) {
    return request({
        url: "/api/Repair/DeleteBadCodeInformation",
        method: "post",
       data
    });
}

//获取不良类别下的代码
export function QueryBadCodeFromType(data:any) {
    return request({
        url: "/api/Repair/QueryBadCodeFromType",
        method: "post",
       data
    });
}
//获取线体
export function QueryMfgLine(data:any) {
    return request({
        url: "/api/Repair/QueryMfgLine",
        method: "post",
       data
    });
}
//获取设备
export function QueryEquipment(data:any) {
    return request({
        url: "/api/Repair/QueryEquipment",
        method: "post",
       data
    });
}

//新增不良产品信息
export function InsertXYL_BadProductInformation(data:any) {
    return request({
        url: "/api/Repair/InsertXYL_BadProductInformation",
        method: "post",
       data
    });
}



export function QueryXYL_BadProductInformation(data:any) {
    return request({
        url: "/api/Repair/QueryXYL_BadProductInformation",
        method: "post",
       data
    });
}
//查询不良待维修记录
export function QueryXYL_BadProductInformationFromContainer(data:any) {
    return request({
        url: "/api/Repair/QueryXYL_BadProductInformationFromContainer",
        method: "post",
       data
    });
}
//维修操作
export function UpdateXYL_BadProductInformation(data:any) {
    return request({
        url: "/api/Repair/UpdateXYL_BadProductInformation",
        method: "post",
       data
    });
}



//报废确认
export function UpdateXYL_BadProductInformationScrapRevd(data:any) {
    return request({
        url: "/api/Repair/UpdateXYL_BadProductInformationScrapRevd",
        method: "post",
       data
    });
}

//维修记录
export function QueryXYL_BadProductInformationRepairRecord(data:any) {
    return request({
        url: "/api/Repair/QueryXYL_BadProductInformationRepairRecord",
        method: "post",
       data
    });
}


// export function QueryXYL_BadProductInformationScrap(data:any) {
//     return request({
//         url: "/Repair/QueryXYL_BadProductInformationScrap",
//         method: "post",
//        data
//     });
// }
//查询审核料号信息
export function QueryXYL_BadExamine(data:any) {
    return request({
        url: "/api/Repair/QueryXYL_BadExamine",
        method: "post",
       data
    });
}
//新增审核料号信息
export function InsertXYL_BadExamine(data:any) {
    return request({
        url: "/api/Repair/InsertXYL_BadExamine",
        method: "post",
       data
    });
}
//修改审核料号信息
export function UpdateXYL_BadExamine(data:any) {
    return request({
        url: "/api/Repair/UpdateXYL_BadExamine",
        method: "post",
       data
    });
}

//删除审核料号信息
export function DeleteXYL_BadExamine(data:any) {
    return request({
        url: "/api/Repair/DeleteXYL_BadExamine",
        method: "post",
       data
    });
}

//获取报废审批  
export function QueryDistinctPCBIDFormScrap(data:any) {
    return request({
        url: "/api/Repair/QueryDistinctPCBIDFormScrap",
        method: "post",
       data
    });
}
//获取报废审批明细 /Repair/QueryXYL_BadProductInformationScrap
export function QueryXYL_BadProductInformationScrap(data:any) {
    return request({
        url: "/api/Repair/QueryXYL_BadProductInformationScrap",
        method: "post",
       data
    });
}
//查询不良明细
export function QueryXYL_BadProductInformationFromByNo(data:any) {
    return request({
        url: "/api/Repair/QueryXYL_BadProductInformationFromByNo",
        method: "post",
       data
    });
}

//查询更换物料
export function QueryXYL_BadProductInformationRepairMaterial(data:any) {
    return request({
        url: "/api/Repair/QueryXYL_BadProductInformationRepairMaterial",
        method: "post",
       data
    });
}

//获取物料id的物料和名称和描述
export function GetGetMarterialNameDesc(data:any) {
    return request({
        url: "/api/Repair/GetGetMarterialNameDesc",
        method: "post",
       data
    });
}