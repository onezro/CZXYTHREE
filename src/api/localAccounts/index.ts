import request from "@/request/permissRequest";

// 查询员工列表（分页，仅用于账号页选择关联员工）
export function getEmployeeList(params: any) {
  return request({
    url: "/api/localAccounts/employees",
    method: "get",
    params,
  });
}

// 查询账号列表（分页）
export function getAccountList(params: any) {
  return request({
    url: "/api/localAccounts/accounts",
    method: "get",
    params,
  });
}

// 查询角色选项
export function getAccountRoles() {
  return request({
    url: "/api/localAccounts/roles",
    method: "get",
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
