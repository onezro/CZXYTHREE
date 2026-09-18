import request from "@/request/deviceRequest";

// Magazine出库任务查询分页
export function QueryMagazineOutTaskPage(data: any) {
  return request({
    url: "/api/MagazineOutTask/QueryPage",
    method: "post",
    data,
  });
}

// 获取执行点位下拉框数据
export function GetExecutionPoints(data: any) {
  return request({
    url: "/api/MagazineOutTask/GetExecutionPoints",
    method: "post",
    data,
  });
}
