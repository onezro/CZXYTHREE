import request from "@/request/baseDataRequst";

// 虚拟库存
export function QueryStockVirtual(data: any) {
  return request({
    url: "/api/StockVirtual/Query",
    method: "post",
    data,
  });
}

export function AddStockVirtual(data: any) {
  return request({
    url: "/api/StockVirtual/Add",
    method: "post",
    data,
  });
}

export function UpdateStockVirtual(data: any) {
  return request({
    url: "/api/StockVirtual/Update",
    method: "post",
    data,
  });
}

export function DeleteStockVirtual(data: any) {
  return request({
    url: "/api/StockVirtual/Delete",
    method: "post",
    data,
  });
}
