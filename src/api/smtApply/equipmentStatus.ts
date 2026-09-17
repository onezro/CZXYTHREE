import request from "@/request/deviceRequest";

// 查询设备状态分页
export function QueryEquipmentColStatus(data: any) {
  return request({
    url: "/api/Equipment/QueryEquipmentColStatus",
    method: "post",
    data,
  });
}
