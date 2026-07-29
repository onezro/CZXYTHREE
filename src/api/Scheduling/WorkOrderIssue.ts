import request from "@/request/smtApplyRequest";
export function QueryReturnMaterials(data:any) {
  return request({
    url: "/api/WorkOrderGroupMaterialIssue/QueryReturnMaterials",
    method: "post",
    data
  });
}


export function InitRecordsFromReceive(data:any) {
  return request({
    url: "/api/WorkOrderGroupMaterialIssue/InitRecordsFromReceive",
    method: "post",
    data
  });
}
export function IssueMaterials(data:any) {
  return request({
    url: "/api/WorkOrderGroupMaterialIssue/IssueMaterials",
    method: "post",
    data
  });
}
