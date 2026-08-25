import request from "@/request/smtApplyRequest";

export function SyncOperation() {
  return request({
    url: "/api/SMTValorMoveOperation/SyncOperation",
    method: "post",
    data: {},
  });
}

export function QueryOperationPage(data: any) {
  return request({
    url: "/api/SMTValorMoveOperation/QueryOperationPage",
    method: "post",
    data,
  });
}

export function UpdateOperationConfig(data: any) {
  return request({
    url: "/api/SMTValorMoveOperation/UpdateOperationConfig",
    method: "post",
    data,
  });
}
