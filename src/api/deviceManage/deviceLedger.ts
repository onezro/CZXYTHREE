import request from "@/request/deviceRequest"


//新增
export function AddMachinery(data:any) {
    return request({
        url: "/api/DeviceManager/AddMachinery",
        method: "post",
       data
    });
}
//查询
export function GetPagedMachineries(data:any) {
    return request({
        url: "/api/DeviceManager/GetPagedMachineries",
        method: "post",
       data
    });
}
//删除

export function DeleteMachineryById(data:any) {
    return request({
        url: `/api/DeviceManager/DeleteMachineryById/${data}`,
        method: "delete",

    });
}
export function UpdataMachinery(data:any) {
    return request({
        url: "/api/DeviceManager/UpdataMachinery",
        method: "post",
       data
    });
}