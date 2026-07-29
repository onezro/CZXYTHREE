import request from "@/request/baseDataRequst";

export function getFinshOrder(data:any) {
  return request({
    url: "/api/Order/GetFinishOrder",
    method: "get",
    data
  });
}
//保存
export function SaveIntactProduct(data:any,code:any) {
  return request({
    url: "/api/IntactProduct/SaveIntactProduct",
    method: "post",
    params: {code:code},
    data
  });
}

export function TransferData(data:any) {
  return request({
    url: "/api/RepairESMove/TransferData",
    method: "post",
    data,
  });
}

export function getContainerMoves(data:any) {
    return request({
      url: "/api/Container/getContainerMoves",
      method: "post",
      params: {
        conName: data,
      },
    });
  }
//smt查询
export function getPCBMoves(data:any) {
    return request({
      url: "/api/Container/getPCBMoves",
      method: "post",
      params: {
        conName: data,
      },
    });
  }