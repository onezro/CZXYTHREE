import request from "@/request/smtApplyRequest";
//开班检（首检）
export function GetFirstInspectData(data:any) {
    return request({
        url: "/api/Repair/FI/Query",
        method: "post",
        data
    });
}
export function InsertFirstInspectData(data:any) {
    return request({
        url: "/api/Repair/FI/Insert",
        method: "post",
        data
    });
}

export function UpdateFirstInspectData(data:any) {
    return request({
        url: "/api/Repair/FI/Update",
        method: "post",
        data
    });
}
export function DeleteFirstInspectData(data:any) {
    return request({
        url: "/api/Repair/FI/Delete",
        method: "post",
        data
    });
}

//巡检
export function GetPatrolInspectData(data:any) {
    return request({
        url: "/api/Repair/RI/Query",
        method: "post",
        data
    });
}
export function InserPatrolInspectData(data:any) {
    return request({
        url: "/api/Repair/RI/Insert",
        method: "post",
        data
    });
}

export function UpdatePatrolInspectData(data:any) {
    return request({
        url: "/api/Repair/RI/Update",
        method: "post",
        data
    });
}
export function DeletePatrolInspectData(data:any) {
    return request({
        url: "/api/Repair/RI/Delete",
        method: "post",
        data
    });
}
//末检
export function GetFinalInspectData(data:any) {
    return request({
        url: "/api/Repair/SI/Query",
        method: "post",
        data
    });
}
export function InserFinalInspectData(data:any) {
    return request({
        url: "/api/Repair/SI/Insert",
        method: "post",
        data
    });
}

export function UpdateFinalInspectData(data:any) {
    return request({
        url: "/api/Repair/SI/Update",
        method: "post",
        data
    });
}
export function DeleteFinalInspectData(data:any) {
    return request({
        url: "/api/Repair/SI/Delete",
        method: "post",
        data
    });
}
//---------------设备-------------
export function GetEquipInspectData(data:any) {
    return request({
        url: "/api/Repair/EI/Query",
        method: "post",
        data
    });
}
export function InserEquipInspectData(data:any) {
    return request({
        url: "/api/Repair/EI/Insert",
        method: "post",
        data
    });
}

export function UpdateEquipInspectData(data:any) {
    return request({
        url: "/api/Repair/EI/Update",
        method: "post",
        data
    });
}
export function DeleteEquipInspectData(data:any) {
    return request({
        url: "/api/Repair/EI/Delete",
        method: "post",
        data
    });
}
//---------工艺点检-----
export function GetCraftInspectData(data:any) {
    return request({
        url: "/api/Repair/WI/Query",
        method: "post",
        data
    });
}
export function InserCraftInspectData(data:any) {
    return request({
        url: "/api/Repair/WI/Insert",
        method: "post",
        data
    });
}

export function UpdateCraftInspectData(data:any) {
    return request({
        url: "/api/Repair/WI/Update",
        method: "post",
        data
    });
}
export function DeleteCraftInspectData(data:any) {
    return request({
        url: "/api/Repair/WI/Delete",
        method: "post",
        data
    });
}
//查询结果
export function QueryInspection(data:any) {
    return request({
        url: "/api/Repair/XingYuAPI/QueryInspection",
        method: "post",
        data
    });
}