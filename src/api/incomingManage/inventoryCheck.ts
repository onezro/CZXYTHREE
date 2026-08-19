import request from "@/request/smtApplyRequest";

//获取物料接收列表
export function QueryMaterialReceiveList(data:any) {
    return request({
        url: "/api/iqc/QueryMaterialReceiveList",
        method: "post",
        data
    });
}
