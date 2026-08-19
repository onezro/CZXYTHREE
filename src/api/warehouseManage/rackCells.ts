import request from "@/request/baseDataRequst";

// 储位
export function QueryRackCells(data: any) {
  return request({
    url: "/api/RackCells/Query",
    method: "post",
    data,
  });
}

export function AddRackCells(data: any) {
  return request({
    url: "/api/RackCells/Add",
    method: "post",
    data,
  });
}

export function UpdateRackCells(data: any) {
  return request({
    url: "/api/RackCells/Update",
    method: "post",
    data,
  });
}

export function DeleteRackCells(data: any) {
  return request({
    url: "/api/RackCells/Delete",
    method: "post",
    data,
  });
}
