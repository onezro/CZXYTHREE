import request from "@/request/deviceRequest"
//新增
export function AddMaintenanceItems(data:any) {
    return request({
        url: "/api/DeviceManager/AddMaintenanceItems",
        method: "post",
       data
    });
}
//查询
export function GetAllMaintenanceItems(data:any) {
    return request({
        url: "/api/DeviceManager/GetAllMaintenanceItems",
        method: "get",
       data
    });
}
//删除

export function DeleteMaintenanceItems(data:any) {
    return request({
        url: `/api/DeviceManager/DeleteMaintenanceItems`,
     method: "post",
       data
    });
}