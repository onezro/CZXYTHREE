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

//获取feed宽度数量
export function GetLineFeederWidthNum(data: any) {
    return request({
        url: "/api/aps/config/GetLineFeederWidthNum",
        method: "post",
        data
    })
}
//新增feed宽度数量
export function IULineFeederWidthNum(data: any) {
    return request({
        url: "/api/aps/config/IULineFeederWidthNum",
        method: "post",
        data
    })
}

//删除feed宽度数量
export function DeleteLineFeederWidthNum(data: any) {
    return request({
        url: "/api/aps/config/DLineFeederWidthNum",
        method: "post",
        data
    })
}

//复制feed宽度数量
export function CopyLineFeederWidthNum(data: any) {
    return request({
        url: "/api/aps/config/CopyLineFeederWidthNum",
        method: "post",
        data
    })
}

//上传feed宽度数量
export function UploadLineFeederWidthNum(data: any) {
    return request({
        url: "/api/aps/config/UploadLineFeederWidthNum",
        method: "post",
        data
    })
}

//上传产线换线时间
export function UploadSwitchLineTime(data: any) {
    return request({
        url: "/api/aps/config/UploadSwitchLineTime",
        method: "post",
        data
    })
}

//上传产品线容量
export function UploadProductLineCapacity(data: any) {
    return request({
        url: "/api/aps/config/UploadProductLineCapacity",
        method: "post",
        data
    })
}
