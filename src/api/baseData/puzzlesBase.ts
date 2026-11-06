import request from "@/request/deviceRequest";
//同步SaiYi信息
export function SyncSaiYiPanelization(data: any) {
  return request({
    url: "/api/Panelization/SyncSaiYiPanelization",
    method: "post",
    data,
  });
}

//查询所有面板信息
export function FindPanelizationList(data: any) {
  return request({
    url: "/api/Panelization/FindPanelizationList",
    method: "post",
    data,
  });
}

//删除面板信息
export function DeletePanelizationList(data: any) {
  return request({
    url: "/api/Panelization/DeletePanelizationList",
    method: "post",
    params: { Obj: data },
  });
}

//新增/更新面板信息
export function AddPanelizationDetail(data: any) {
  return request({
    url: "/api/Panelization/AddPanelizationDetail",
    method: "post",
    data,
  });
}

//更新面板信息
export function UpdatePanelizationDetail(data: any) {
  return request({
    url: "/api/Panelization/UpdatePanelizationDetail",
    method: "post",
    data,
  });
}
//更新面板信息
export function UpdatePanelizationList(data: any) {
  return request({
    url: "/api/Panelization/UpdatePanelizationList",
    method: "post",
    data,
  });
}

//根据Pn
export function FindPnDetail(data: any) {
  return request({
    url: "/api/Panelization/FindPnDetail",
    method: "post",
    params: { pn: data },
  });
}

//根据面板ID查询零件信息
export function FindPartNumberData(data: any) {
  return request({
    url: "/api/Panelization/FindPartNumberData",
    method: "post",
    params: { pn: data },
  });
}

//拼板草稿-分页查询
export function FindPanelizationDraftPage(data: any) {
  return request({
    url: "/api/PanelizationDraft/FindPage",
    method: "post",
    data,
  });
}

//拼板草稿-查询单条数据
export function GetPanelizationDraft(data: any) {
  return request({
    url: "/api/PanelizationDraft/Get",
    method: "post",
    data,
  });
}

//拼板草稿-新增/修改
export function SavePanelizationDraft(data: any) {
  return request({
    url: "/api/PanelizationDraft/Save",
    method: "post",
    data,
  });
}

//拼板草稿-启用
export function EnablePanelizationDraft(data: any) {
  return request({
    url: "/api/PanelizationDraft/Enable",
    method: "post",
    data,
  });
}

//拼板草稿-暂存删除
export function MarkDeletePanelizationDraft(data: any) {
  return request({
    url: "/api/PanelizationDraft/MarkDelete",
    method: "post",
    data,
  });
}

//拼板草稿-放弃草稿
export function DiscardPanelizationDraft(data: any) {
  return request({
    url: "/api/PanelizationDraft/Discard",
    method: "post",
    data,
  });
}
