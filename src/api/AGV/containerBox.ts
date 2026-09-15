import request from "@/request/deviceRequest";

// 箱码查询分页
export function QueryContainerBoxPage(data: any) {
  return request({
    url: "/api/ContainerBox/QueryPage",
    method: "post",
    data,
  });
}
