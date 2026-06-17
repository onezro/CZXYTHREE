import request from "@/request/deviceRequest"

//查询维修代码
export function GetFaultCodes(data:any) {
    return request({
        url: "/api/DeviceManager/GetFaultCodes",
        method: "post",
        data,
    });
}

//更新维修代码
export function UpdateFaultCode(data:any) {
    return request({
        url: "/api/DeviceManager/UpdateFaultCode",
        method: "post",
        data,
    });
}
//删除维修代码
export function DeleteFaultCode(data:any) {
    return request({
        url: "/api/DeviceManager/DeleteFaultCode",
        method: "post",
        data,
    });
}
//创建维修代码
export function CreateFaultCode(data:any) {
    return request({
        url: "/api/DeviceManager/CreateFaultCode",
        method: "post",
        data,
    });
}

//查询维修订单
export function GetRepairOrders(data:any) {
    return request({
        url: "/api/DeviceManager/GetRepairOrders",
        method: "post",
        data,
    });
}

//创建维修订单
export function CreateRepairOrder(data:any) {
    return request({
        url: "/api/DeviceManager/CreateRepairOrder",
        method: "post",
        data,
    });
}
//更新维修订单
export function UpdateRepairOrder(data:any) {
    return request({
        url: "/api/DeviceManager/UpdateRepairOrder",
        method: "post",
        data,
    });
}
//取消维修订单
export function CancelRepairOrder(data:any) {
    return request({
        url: "/api/DeviceManager/CancelRepairOrder",
        method: "post",
        data,
    });
}
//创建维修记录
export function CreateRepairRecord(data:any) {
    return request({
        url: "/api/DeviceManager/CreateRepairRecord",
        method: "post",
        data,
    });
}
//查询维修记录
export function GetRepairRecords(data:any) {
    return request({
        url: "/api/DeviceManager/GetRepairRecords",
        method: "post",
        data,
    });
}
//更新维修记录
export function UpdateRepairRecord(data:any) {
    return request({
        url: "/api/DeviceManager/UpdateRepairRecord",
        method: "post",
        data,
    });
}
//删除维修记录
export function DeleteRepairRecord(data:any) {
    return request({
        url: "/api/DeviceManager/DeleteRepairRecord",
        method: "post",
        data,
    });
}
