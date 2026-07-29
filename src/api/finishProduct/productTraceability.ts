import request from "@/request/baseDataRequst";
import request1 from "@/request/smtSet/smtSetReuqest";
export function XY_PCBAHisControl(data:any) {
  return request1({
    url: "/XingYuAPI/XY_PCBAHisControl",
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

export function GetCodeBYPcbSN(code:any) {
  return request({
    url: "/api/IntactProduct/GetCodeBYPcbSN",
    method: "post",
    params: { code: code },
  });
}
