import request from "@/request/smtApplyRequest";
//获取线体信息
export function GetSMTValorLine(data:any) {
    return request({
        url: "/api/ChangeOver/GetSMTValorLine",
        method: "post",
        data,
    });
}
//获取工单列表
export function GetSMTValorChangeLineWoList(data:any) {
    return request({
        url: "/api/ChangeOver/GetSMTValorChangeLineWoList",
        method: "post",
        data,
    });
}
//获取工单详细信息
export function GetValorChangeLineWoNew(data:any) {
    return request({
        url: "/api/ChangeOver/GetValorChangeLineWoNew",
        method: "post",
        data,
    });
}
//获取设备
export function GetSMTValorLineEquipMent(data:any) {
    return request({
        url: "/api/ChangeOver/GetSMTValorLineEquipMent",
        method: "post",
        data,
    });
}

//获取设备状态
export function GetValorChangeLineWoEquipStatus(data:any) {
    return request({
        url: "/api/ChangeOver/GetValorChangeLineWoEquipStatus",
        method: "post",
        data,
    });
}

//获取设备状态
export function SMTChangeOverByOneKey(data:any) {
    return request({
        url: "/api/ChangeOver/SMTChangeOverByOneKey",
        method: "post",
        data,
    });
}
//获取设备  
export function GetChangeOverMcAndConveyorSetting(data:any) {
    return request({
        url: "/api/ChangeOver/GetChangeOverMcAndConveyorSetting",
        method: "post",
        data,
    });
}

//开启
export function UpdateMcAndConveyorSetting(data:any) {
    return request({
        url: "/api/ChangeOver/UpdateMcAndConveyorSetting",
        method: "post",
        data,
    });
}
