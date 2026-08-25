import request from "@/request/smtApplyRequest";
export function QueryReturnMaterials(data:any) {
  return request({
    url: "/api/WorkOrderGroupMaterialIssue/QueryReturnMaterials",
    method: "post",
    data
  });
}

export function QueryReturnMaterialDetails(data:any) {
  return request({
    url: "/api/WorkOrderGroupMaterialIssue/QueryReturnMaterialDetails",
    method: "post",
    data
  });
}

export function QueryIssueDetails(data:any) {
  return request({
    url: "/api/WorkOrderGroupMaterialIssue/QueryIssueDetails",
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
