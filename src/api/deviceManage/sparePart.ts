import request from "@/request/deviceRequest"

//获取备件列表
export function GetPartsList(data: any) {
  return request({
    url: `/api/DeviceManager/GetPartsList`,
    method: "post",
    data,
  });
}

//创建备件
export function CreatePart(data: any) {
  return request({
    url: `/api/DeviceManager/CreatePart`,
    method: "post",
    data,
  });
}

//更新备件
export function UpdatePart(data: any) {
  return request({
    url: `/api/DeviceManager/UpdatePart`,
    method: "post",
    data,
  });
}


//获取备件库存
export function GetStocks(data: any) {
  return request({
    url: `/api/DeviceManager/GetStocks`,
    method: "post",
    data,
  });
}
//获取备件交易记录
export function GetTransaction(data: any) {
  return request({
    url: `/api/DeviceManager/GetTransaction`,
    method: "post",
    data,
  });
}

//入库
export function InStock(data: any) {
  return request({
    url: `/api/DeviceManager/InStock`,
    method: "post",
    data,
  });
}

//出库
export function OutStock(data: any) {
  return request({
    url: `/api/DeviceManager/OutStock`,
    method: "post",
    data,
  });
}
