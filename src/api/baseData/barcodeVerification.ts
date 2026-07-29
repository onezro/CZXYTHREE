import request from "@/request/baseDataRequst";

//查询核对基础数据
export function QueryChecProductFoundation(data: any) {
    return request({
        url: "/api/ProductCheck/QueryChecProductFoundation",
        method: "post",
        data
    });
}

//新增核对基础数据
export function InsertChecProductFoundation(data: any) {
    return request({
        url: "/api/ProductCheck/InsertChecProductFoundation",
        method: "post",
        data
    });
}

//修改核对基础数据
export function UpdateChecProductFoundation(data: any) {
    return request({
        url: "/api/ProductCheck/UpdateChecProductFoundation",
        method: "post",
        data
    });
}

//删除核对基础数据
export function DeleteChecProductFoundation(data: any) {
    return request({
        url: "/api/ProductCheck/DeleteChecProductFoundation",
        method: "post",
        data
    });
}

//根据id查询核对基础数据(修改时使用)
export function QueryChecProductFoundationById(data: any) {
    return request({
        url: "/api/ProductCheck/QueryChecProductFoundationById",
        method: "post",
        data
    });
}

//操作历史查询
export function QueryChecProductLog(data: any) {
    return request({
        url: "/api/ProductCheck/QueryChecProductLog",
        method: "post",
        data
    });
}
