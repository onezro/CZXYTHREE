import request from "@/request/smtApplyRequest";

//获取线体信息
export function GetMillingValorLine(data:any) {
    return request({
        url: "/api/MillingChangeOver/GetMillingValorLine",
        method: "post",
        data,
    });
}

//获取工单列表
export function GetMillingValorChangeLineWoList(data:any) {
    return request({
        url: "/api/MillingChangeOver/GetMillingValorChangeLineWoList",
        method: "post",
        data,
    });
}

//按类型获取产品编码及对应工单（type: AOI/ICT）
export function GetChangeLineWoPN(data:any) {
    return request({
        url: "/api/ChangeOver/GetChangeLineWoPN",
        method: "post",
        data,
    });
}

//获取工单详细信息
export function GetMillingValorChangeLineWoNew(data:any) {
    return request({
        url: "/api/MillingChangeOver/GetMillingValorChangeLineWoNew",
        method: "post",
        data,
    });
}

//获取设备
export function GetMillingValorLineEquipMent(data:any) {
    return request({
        url: "/api/MillingChangeOver/GetMillingValorLineEquipMent",
        method: "post",
        data,
    });
}

//获取设备状态
export function MillingChangeOverByOneKey(data:any) {
    return request({
        url: "/api/MillingChangeOver/MillingChangeOverByOneKey",
        method: "post",
        data,
    });
}

//获取设备状态
export function GetMillingChangeLineWoEquipStatus(data:any) {
    return request({
        url: "/api/MillingChangeOver/GetMillingChangeLineWoEquipStatus",
        method: "post",
        data,
    });
}
