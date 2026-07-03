
import request from '@/request/baseDataRequst'
export function findPanelizationList(data:any) {
    return request({
        url: "/api/Panelization/findPanelizationList",
        method: "post",
        data,
    });
}
export function addPanelizationList(data:any) {
    return request({
        url: "/api/Panelization/addPanelizationList",
        method: "post",
        data,
    });
}

export function DeletePanelizationList(data:any) {
    return request({
        url: "/api/Panelization/DeletePanelizationList",
        method: "post",
        params:{
            Obj:data
        }
    });
}

export function findPnDetail(data:any) {
    return request({
        url: "/api/Panelization/findPnDetail",
        method: "post",
        params:{
            pn:data
        },
    });
}
export function addPanelizationdetail(data:any) {
    return request({
        url: "/api/Panelization/addPanelizationdetail",
        method: "post",
        data,
    });
}
export function DeletePanelizationDetail(data:any) {
    return request({
        url: "/api/Panelization/DeletePanelizationDetail",
        method: "post",
        data,
    });
}
export function UpdatePanelizationList(data:any) {
    return request({
        url: "/api/Panelization/UpdatePanelizationList",
        method: "post",
        data,
    });
}



export function UpdatePanelizationDetail(data:any) {
    return request({
        url: "/api/Panelization/UpdatePanelizationDetail",
        method: "post",
        data,
    });
}

export function QueryPanelmergeAllList(data:any) {
    return request({
        url: "/api/Panelmerge/QueryPanelmergeAllList",
        method: "post",
        data,
    });
}

export function QueryPanelmerge(data:any) {
    return request({
        url: "/api/Panelmerge/QueryPanelmerge",
        method: "post",
        data,
    });
}
export function addPanelmergeList(data:any) {
    return request({
        url: "/api/Panelmerge/addPanelmergeList",
        method: "post",
        data,
    });
}
export function DeletePanelmerge(data:any) {
    return request({
        url: "/api/Panelmerge/DeletePanelmerge",
        method: "post",
        data,
    });
}
export function QueryFoundation(data:any) {
    return request({
        url: "/api/Panelmerge/QueryFoundation",
        method: "post",
        data,
    });
}
export function findPartNumberData(data:any) {
    return request({
        url: "/api/Panelization/findPartNumberData",
        method: "post",
        params:{
            pn:data
        }
    });
}