import request from "@/request/smtApplyRequest";

//获取一级
export function GetWorkLineCalendarSelectTypeLevelOne(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/GetWorkLineCalendarSelectTypeLevelOne",
        method: "post",
        data
    })
}
//获取二级
export function GetWorkLineCalendarSelectTypeLevelTwo(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/GetWorkLineCalendarSelectTypeLevelTwo",
        method: "post",
        data
    })
}
//新增
export function AddWorkLineCalendarSelectTypeLevelOne(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/AddWorkLineCalendarSelectTypeLevelOne",
        method: "post",
        data
    })
}
export function AddWorkLineCalendarSelectTypeLevelTwo(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/AddWorkLineCalendarSelectTypeLevelTwo",
        method: "post",
        data
    })
}
//修改
export function UpdateWorkLineCalendarSelectTypeLevelOne(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/UpdateWorkLineCalendarSelectTypeLevelOne",
        method: "post",
        data
    })
}
export function UpdateWorkLineCalendarSelectTypeLevelTwo(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/UpdateWorkLineCalendarSelectTypeLevelTwo",
        method: "post",
        data
    })
}
//删除
export function DeleteWorkLineCalendarSelectTypeLevelOne(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/DeleteWorkLineCalendarSelectTypeLevelOne",
        method: "post",
        data
    })
}
export function DeleteWorkLineCalendarSelectTypeLevelTwo(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/DeleteWorkLineCalendarSelectTypeLevelTwo",
        method: "post",
        data
    })
}
//获取产线
export function GetMESWorkLineNews(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/GetMESWorkLineNews",
        method: "post",
        data
    })
}
//产线日历
export function GetPPMWorkLineNews(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/GetPPMWorkLineNews",
        method: "post",
        data
    })
}
//添加主日程
export function AddUpdateHostCalendar(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/AddUpdateHostCalendar",
        method: "post",
        data
    })
}
//添加日程计划
export function AddCalendarPlan(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/AddCalendarPlan",
        method: "post",
        data
    })
}

//删除日期计划
export function DeleteCalendarPlan(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/DeleteCalendarPlan",
        method: "post",
        data
    })
}
//修改日期计划
export function UpdateCalendarPlan(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/UpdateCalendarPlan",
        method: "post",
        data
    })
}
//获取日程计划
export function SelectCalendarPlan(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/SelectCalendarPlan",
        method: "post",
        data
    })
}
//获取产线日期信息
export function GetWorkLineCalendarAndPlan(data: any) {
    return request({
        url: "/api/aps/worklinecalendar/GetWorkLineCalendarAndPlan",
        method: "post",
        data
    })
}

