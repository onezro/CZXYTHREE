import request from "@/request/reportRequest/assemble";
import request1 from "@/request/baseDataRequst/index";
import request2 from "@/request/reportRequest/camstar";
import request3 from "@/request/smtSet/smtSetReuqest";

export function XY_Assembly_OrderStatus(data: any) {
  return request3({
    url: "/XingYuAPI/XY_Assembly_OrderStatus",
    method: "post",
    data,
  });
}

//抛料记录查询
export function GetMaterialLossData(data: any) {
  return request1({
    url: "/api/ReportQuery/GetMaterialLossData",
    method: "post",
    data,
  });
}

export function GetMaterialLossDetail(data: any) {
  return request1({
    url: "/api/ReportQuery/GetMaterialLossDetail",
    method: "post",
    data,
  });
}

//接料
export function GetWoOperatorTrace(data: any) {
  return request1({
    url: "/api/ReportQuery/GetWoOperatorTrace",
    method: "post",
    data,
  });
}

export function GetPrintingTranslator(data: any) {
  return request1({
    url: "/api/ReportQuery/GetPrintingTranslator",
    method: "post",
    data,
  });
}


//获取pcb追溯数据
export function QueryPCBDateBackTo(data:any) {
    return request1({
        url: "/api/ReportQuery/QueryPCBDateBackTo",
        method: "post",
        data,
    });
}

//获取Camstar和Valor合并线体
export function GetCamstarValorLine(data:any) {
    return request1({
        url: "/api/ReportQuery/GetCamstarValorLine",
        method: "post",
        data,
    });
}

//获取Camstar和Valor合并资源
export function GetCamstarValorEquip(data:any) {
    return request1({
        url: "/api/ReportQuery/GetCamstarValorEquip",
        method: "post",
        data,
    });
}

export function getContainerMoves(conName:any) {
  return request2({
    url: "/container/getContainerMoves",
    method: "post",
    data: conName
  });
}

export function XY_PCBAHisQTYControl(data:any) {
  return request3({
    url: "/XingYuAPI/XY_PCBAHisQTYControl",
    method: "post",
    data
  });
}

export function XY_SMT_OrderStatus(data:any) {
  return request3({
    url: "/XingYuAPI/XY_SMT_OrderStatus",
    method: "post",
    data
  });
}


  export function GetCompId(data:any) {
    return request1({
      url: "/api/Pda/GetCompId",
      method: "post",
      data
    });
  }

    export function QueryOperator(data:any) {
    return request1({
      url: "/api/Pda/QueryOperator",
      method: "post",
      data
    });
  }

  export function XY_PCBAHisYieldControl(data:any) {
  return request3({
    url: "/XingYuAPI/XY_PCBAHisYieldControl",
    method: "post",
    data
  });
}

//工治具
export function GetToolChkOutList(data:any) {
    return request1({
        url: "/api/Pda/GetToolChkOutList",
        method: "post",
        data,
    });
}