import request from "@/request/baseDataRequst/index";


//组装线过站记录查询
export function GetAssSpecMoveHistory(data: any) {
  return request({
    url: "/api/AssSpec/GetAssSpecMoveHistory",
    method: "post",
    data,
  });
}

//组装线过站数据采集记录
export function GetAssSpecDataList(data: any) {
  return request({
    url: "/api/AssSpec/GetAssSpecDataList",
    method: "post",
    data,
  });
}

//组装线过站组件物料记录
export function GetAssSpecMaterialBind(data: any) {
  return request({
    url: "/api/AssSpec/GetAssSpecMaterialBind",
    method: "post",
    data,
  });
}

//组装线过站NG记录
export function GetAssSpecNGList(data: any) {
  return request({
    url: "/api/AssSpec/GetAssSpecNGList",
    method: "post",
    data,
  });
}

//获取工序
export function GetAssSpec() {
  return request({
    url: "/api/AssSpec/GetAssSpec",
    method: "post"
  });
}