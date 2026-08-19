import request from "@/request/baseDataRequst/index";

//查询文件SOP
export function QueryXYLProductSOP(data:any) {
    return request({
        url: "/api/ProductSOP/QueryXYLProductSOP",
        method: "post",
        data
    });
}


//查询MES料号
export function GetESReportViewProduct(data:any) {
    return request({
        url: "/api/ProductSOP/GetESReportViewProduct",
        method: "post",
        data
    });
}
//删除文件SOP
export function DeleteXYLProductSOP(data:any) {
    return request({
        url: "/api/ProductSOP/DeleteXYLProductSOP",
        method: "post",
        data
    });
}


//新增文件SOP(新)
export function InsertXYLProductSOPNew(data:any) {
    return request({
        url: "/api/ProductSOP/InsertXYLProductSOPNew",
        method: "post",
        data
    });
}

//修改文件SOP(新)
export function UpdateXYLProductSOPNew(data:any) {
    return request({
        url: "/api/ProductSOP/UpdateXYLProductSOPNew",
        method: "post",
        data
    });
}