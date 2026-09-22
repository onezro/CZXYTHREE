import request from "@/request/deviceRequest";

// 查询装箱数据
export function QueryPackingData(data: any) {
  return request({
    url: "/api/mes/millingboard/querypackingdata",
    method: "post",
    data,
  });
}
