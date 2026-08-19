import request from "@/request/smtApplyRequest";


//添加箱号
export function AddBoxInfo(data:any) {
    return request({
        url: "/api/BoxInfo/AddBoxInfo",
        method: "post",
        data
    });
}

//更新箱号
export function UpdateBoxInfo(data:any) {
    return request({
        url: "/api/BoxInfo/UpdateBoxInfo",
        method: "post",
        data
    });
}
//删除箱号
export function DeleteBoxInfo(data:any) {
    return request({
        url: "/api/BoxInfo/DeleteBoxInfo",
        method: "post",
       data
    });
}
//获取箱号列表
export function QueryBoxInfoList(data:any) {
    return request({
        url: "/api/BoxInfo/QueryBoxInfoList",
        method: "post",
        data
    });
}
