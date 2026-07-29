import request from "@/request/baseDataRequst";

// 组装过程提交
export function processSumbit(data: any) {
  return request({
    url: "/api/AssSpec/AssemblyRework",
    method: "post",
    data,
  });
}

export function AssemblyReworkHistory(data: any) {
  return request({
    url: "/api/AssSpec/AssemblyReworkHistory",
    method: "post",
    data,
  });
}
