import request from "@/request/smtApplyRequest";

//获取产线换线时间
export function GetSwitchLineTime(data: any) {
    return request({
        url: "/api/aps/config/GetSwitchLineTime",
        method: "post",
        data
    })
}

//获取产线换线新增
export function InsertUpdateSwitchLineTime(data: any) {
    return request({
        url: "/api/aps/config/InsertUpdateSwitchLineTime",
        method: "post",
        data
    })
}
//删除产线换线
export function DeleteSwitchLineTime(data: any) {
    return request({
        url: "/api/aps/config/DeleteSwitchLineTime",
        method: "post",
        data
    })
}

//获取产线换线时间
export function GetProductLineCapacity(data: any) {
    return request({
        url: "/api/aps/config/GetProductLineCapacity",
        method: "post",
        data
    })
}

//获取产线换线新增
export function InsertUpdateProductLineCapacity(data: any) {
    return request({
        url: "/api/aps/config/InsertUpdateProductLineCapacity",
        method: "post",
        data
    })
}
//删除产线换线
export function DeleteProductLineCapacity(data: any) {
    return request({
        url: "/api/aps/config/DeleteProductLineCapacity",
        method: "post",
        data
    })
}
