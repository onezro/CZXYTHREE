import request from "@/request/permissRequest";
//登录
export function empolyeeLogin(data) {
    return request({
        url: "/api/employee/login",
        method: "post",
        data,
    });
}
//获取用户信息
export function getEmpoyeeInfo(data) {
    return request({
        url: "/api/employee/findByEmployeeName",
        method: "post",
        params:{
            employeeName:data
        }
    });
}
export function getInfo() {
    return request({
        url: "/api/employee/findUserInfoBytoken",
        method: "post",
    });
}

export function getMenu() {
    return request({
        url: "/api/employee/findMenuBytoken",
        method: "post",
    });
}

export function getMenuOPUI() {
    return request({
        url: "/api/employee/findMenuListByOPUI",
        method: "post",
    });
}

export function getWorksMenuOPUI() {
    return request({
        url: "/api/employee/findWorkstationListByOPUI",
        method: "post",
    });
}

//获取全部菜单
export function getFirstMeun() {
    return request({
        url: "/api/menu/findAll",
        method: "post",
    });
}
//获取角色的菜单
export function getRoleMenuse(data) {
    return request({
        url: "/api/role/getRoleMenus",
        method: "post",
        params: {
            roleid: data,
        },
    });
}



//添加菜单
export function addMeun(data) {
    return request({
        url: "/api/menu/add",
        method: "post",
        data,
    });
}

//删除菜单
export function deleteMeun(data) {
    return request({
        url: "/api/menu/delete",
        method: "post",
        params: {
            id: data,
        },
    });
}

//修改菜单
export function updateMeun(data) {
    return request({
        url: "/api/menu/update",
        method: "post",
        data,
    });
}

//获取所有角色
export function getAllRole() {
    return request({
        url: "/api/role/findAll",
        method: "post",
    });
}

//
export function addRole(data) {
    return request({
        url: "/api/role/add",
        method: "post",
        data,
    });
}

export function getMeunRole(data) {
    return request({
        url: "/api/role/getRoleMenus",
        method: "post",
        params: {
            roleId: data,
        },
    });
}

export function updateRoleMeun(data) {
    return request({
        url: "/api/role/update",
        method: "post",
        data
    });
}
export function deleteRole(data) {
    return request({
        url: "/api/role/delete",
        method: "post",
        params: {
            roleId: data,
        },
    });
}

export function getEmployee() {
    return request({
        url: "/api/employee/findAll",
        method: "post",

    });
}
//获取用户角色
export function findEmployeeRoles(data) {
    return request({
        url: "/api/employeerole/findEmployeeRoles",
        method: "post",
        params: {
            empid: data,
        },
    });
}
//添加角色
export function addEmployeeRole(data) {
    return request({
        url: "/api/employeerole/add",
        method: "post",
        data,
    });
}

export function deletefirstRole(data) {
    return request({
        url: "/api/employeerole/deleteRole",
        method: "post",
        params: data
    });
}

export function deleteEmployee(data) {
    return request({
        url: "/api/employee/DeleteEmployee",
        method: "post",
        params: {
            employeeName: data,
        }
    });
}

export function getOrganization(){
    return request({
        url: "/api/employee/findOrganization",
        method: "post",
    });
}

//重置密码
export function ResetPwd(data) {
    return request({
        url: "/api/employee/UpdateEmpPwd",
        method: "post",
        params: data
    });
}

export function AddEmployee(data) {
    return request({
        url: "/api/employee/AddEmployee",
        method: "post",
        params: data
    });
}

//根据工号查询员工登录历史
export function findEmpLoginLog(data) {
    return request({
        url: "/api/employee/findEmpLoginLog",
        method: "post",
        params: {
            employeeName:data
        }
    });
}

//获取角色的用户
export function getEmployeesByRole(data) {
    return request({
        url: "/api/role/getEmployeesByRole",
        method: "post",
        params: {
            roleid:data
        }
    });
}

//获取角色未绑定的用户列表
export function getUnassignEmployeesByRole(roleid,name) {
    return request({
        url: "/api/role/getUnassignEmployeesByRole",
        method: "post",
        params: {
            roleid,
            name
        }
    });
}

//修改角色的用户列表
export function updateEmployeesByRole(data) {
    return request({
        url: "/api/role/updateEmployeesByRole",
        method: "post",
        data
    });
}
//添加用户
export function OpcenterEmployeeSync(data) {
    return request({
        url: "/api/employee/OpcenterEmployeeSync",
        method: "post",
        data
    });
}

//修改密码
export function UpdateEmpPwd(data) {
    return request({
        url: "/api/employee/UpdateEmpPwd",
        method: "post",
        params: data
    });
}
//重置密码
export function ResetEmpPwd(data) {
    return request({
        url: "/api/employee/ResetEmpPwd",
        method: "post",
        params: data
    });
}