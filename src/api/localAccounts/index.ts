import request from "@/request/permissRequest";

// 查询员工基础资料（分页，新增用户时按工号搜索员工）
export function getBaseEmployeeList(params: any) {
  return request({
    url: "/api/localAccounts/mysql/employees",
    method: "get",
    params,
  });
}

// 新增用户（仅传员工 id，账号与名称由后端按员工信息生成）
export function addUser(data: any) {
  return request({
    url: "/api/localAccounts/mysql/users",
    method: "post",
    data,
  });
}

// 查询系统员工列表（分页）
export function getEmployeeList(params: any) {
  return request({
    url: "/api/localAccounts/employees",
    method: "get",
    params,
  });
}

// 手动新增员工
export function saveEmployee(data: any) {
  return request({
    url: "/api/localAccounts/employees/save",
    method: "post",
    data,
  });
}

// 新增、编辑账号
export function saveAccount(data: any) {
  return request({
    url: "/api/localAccounts/accounts/save",
    method: "post",
    data,
  });
}

// 删除账号（按账号名称）
export function deleteAccount(data: any) {
  return request({
    url: "/api/localAccounts/accounts/delete",
    method: "post",
    data,
  });
}

// 修改当前登录账号密码
export function updateSelfPassword(data: any) {
  return request({
    url: "/api/localAccounts/password",
    method: "post",
    data,
  });
}
