import request from "@/request/baseDataRequst";

// 料架
export function QueryRacks(data: any) {
  return request({
    url: "/api/Racks/Query",
    method: "post",
    data,
  });
}

export function AddRacks(data: any) {
  return request({
    url: "/api/Racks/Add",
    method: "post",
    data,
  });
}

export function UpdateRacks(data: any) {
  return request({
    url: "/api/Racks/Update",
    method: "post",
    data,
  });
}

export function DeleteRacks(data: any) {
  return request({
    url: "/api/Racks/Delete",
    method: "post",
    data,
  });
}
