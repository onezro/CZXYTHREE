
import request from '@/request/baseDataRequst'
export function QueryXYL_ThreePointMatchingDetailInfo(data:any) {
    return request({
      url: "/api/ReportQuery/QueryXYL_ThreePointMatchingDetailInfo",
      method: "post",
      data
    });
  }
  //获取三点照合
   export function QueryXYL_ThreePointMatchingDetailFinalStateInfo(data:any) {
    return request({
      url: "/api/ReportQuery/QueryXYL_ThreePointMatchingDetailFinalStateInfo",
      method: "post",
      data
    });
  }