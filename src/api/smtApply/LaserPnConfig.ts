import request from "@/request/smtApplyRequest";

// 激光PN配置
export function QueryLaserPnConfigList(data: any) {
  return request({
    url: "/api/LaserPnConfig/QueryLaserPnConfigList",
    method: "post",
    data,
  });
}

export function AddLaserPnConfig(data: any) {
  return request({
    url: "/api/LaserPnConfig/AddLaserPnConfig",
    method: "post",
    data,
  });
}

export function UpdateLaserPnConfig(data: any) {
  return request({
    url: "/api/LaserPnConfig/UpdateLaserPnConfig",
    method: "post",
    data,
  });
}

export function DeleteLaserPnConfig(data: any) {
  return request({
    url: "/api/LaserPnConfig/DeleteLaserPnConfig",
    method: "post",
    data,
  });
}
