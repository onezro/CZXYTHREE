<template>
  <div class="p-2 flex gap-[10px]">
    <el-card shadow="always" :body-style="{ padding: '8px' }" class="w-[250px] h-[calc(100vh-97px)]">
      <template #header>
        <div class="card-header flex justify-between items-center">
          <div class="flex gap-[5px] items-center">
            <img style="width: 24px; height: 24px" src="../../assets/svgs/or.svg" alt="" />
            <div class="h-[24px] box-border pt-[3px]">组织</div>
          </div>

          <el-tooltip content="重置" placement="right">
            <el-icon size="24" :class="isLoding" color="#006487" @click="refreshData">
              <RefreshRight />
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-scrollbar class="h-[calc(100vh-160px)]">
        <el-tree style="max-width: 600px" highlight-current :data="organTree" :expand-on-click-node="false" :props="{
          children: 'children',
          label: 'OrganizationName',
        }" @node-click="handleNodeClick" />
      </el-scrollbar>
    </el-card>

    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }" class="flex-1">
      <div class="mb-2 flex justify-between">
        <div></div>
        <div>
          <el-input v-model="searchName" clearable placeholder="请输入">
            <template #append>
              <el-button type="primary" icon="Search"></el-button> </template></el-input>
        </div>
      </div>

      <el-table size="small" :data="tableData1.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        " border :height="tableHeight" stripe>
        <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
        <el-table-column label="工号" prop="employeeName" min-width="100">
        </el-table-column>
        <el-table-column label="员工姓名" prop="fullName" min-width="100">
        </el-table-column>
        <el-table-column label="职称" prop="title" :min-width="flexColumnWidth('职称', 'title')">
        </el-table-column>
        <el-table-column label="组织" prop="OrganizationName" :min-width="170">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" icon="EditPen" size="small" @click="handleEdit(scope.row)" />
            </el-tooltip>
            <el-tooltip content="密码重置" placement="top">
              <el-button type="danger" icon="RefreshLeft" size="small" @click="handleRest(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[30, 50, 100, 150, 200]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData1.length">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="用户角色" v-model="addVisible" width="400px"
      @close="addCancel()">
      <el-form :model="form" ref="formRef" label-width="auto">
        <el-form-item label="员工" prop="roleName">
          <el-input v-model="roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色" prop="role">
          <el-tag class="mb-2" :key="tag.RoleID" v-for="tag in hasRole" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag.RoleName }}
          </el-tag>
        </el-form-item>
        <!-- <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId"  placeholder="请选择角色" :clearable="false">
            <el-option v-for="item in noRole" :key="item.value" :label="item.lable" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="角色" prop="roleIdArr">
          <el-select v-model="form.roleIdArr" multiple >
            <el-option v-for="item in noRole" :key="item.value" :label="item.lable" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCancel()">取消</el-button>
          <el-button type="primary" @click="onSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="编辑" v-model="editVisible" width="400px"
      @close="editCancel()">
      <el-form :model="editForm" ref="editRef" label-width="auto">
        <el-form-item label="员工名" prop="FullName">
          <el-input v-model="editForm.FullName" placeholder="请输入员工名" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="EmployeeName">
          <el-input v-model="editForm.EmployeeName" placeholder="请输入账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="DocManagerUser">
          <el-input v-model="editForm.DocManagerUser" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel()">取消</el-button>
          <el-button type="primary" @click="editSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="重置密码" v-model="restVisible" width="400px"
      @close="upDateCancel()">
      <el-form :model="rePwForm" ref="reFormRef" :rules="rules" label-width="auto">
        <el-form-item label="账号" prop="employeeName">
          <el-input v-model="rePwForm.employeeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input v-model="rePwForm.pwd" placeholder="请输入新密码" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="rePwForm.confirmPwd" placeholder="再次输入新密码" show-password clearable></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="upDateCancel()">取消</el-button>
          <el-button type="primary" @click="upDateSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// import { getToken } from "@/utils/auth";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  getAllRole,
  getEmployee,
  findEmployeeRoles,
  addEmployeeRole,
  deletefirstRole,
  deleteEmployee,
  addEmployee,
  getOrganization,
  ResetPwd,
} from "@/api/permiss";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  computed,
  onBeforeUnmount,
} from "vue";

interface Tag {
  RoleID: string;
  RoleName: string;
}

interface Optiotpe {
  value: string;
  lable: string;
}
interface Table {
  employeeId: string;
  employeeName: string;
  fullName: string;
  RoleName: string[];
}
interface EditForm {
  EmployeeId: string;
  EmployeeName: string;
  CanLogin: number;
  FullName: string;
  DocManagerUser: string;
  IsDelete: string;
  CreateBy: string;
  CreateDate: string;
  UpdateBy: string;
  UpdateDate: string;
}

interface OrganTree {
  Notes: string;
  OrganizationId: string;
  OrganizationName: string;
  OrganizationNumber: string;
  ParentOrganizationId: string;
  children: OrganTree[];
}
const userStore = useUserStoreWithOut();
const tableData = ref<Table[]>([]);
const pageSize = ref(50);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const formRef = ref();
const form = ref({
  employeeName: "",
  id: 0,
  roleId: "",
  roleIdArr:[],
  IsDelete: "",
  CreateBy: userStore.getUserInfo,
  CreateDate: "",
  UpdateBy: "",
  UpdateDate: "",
});
const hasRole = ref<Tag[]>([]);
const roleName = ref("");
const optionArr = ref<Optiotpe[]>([]);
const editForm = reactive<EditForm>({
  EmployeeId: "",
  EmployeeName: "",
  CanLogin: 1,
  FullName: "",
  DocManagerUser: "",
  IsDelete: "",
  CreateBy: "",
  CreateDate: "",
  UpdateBy: userStore.getUserInfo || "",
  UpdateDate: "",
});
const editRef = ref();
const searchName = ref("");
const tableData1 = ref<Table[]>([]);
const organTree = ref<OrganTree[]>([]);
const isLoding = ref("");
const restVisible = ref(false);
const reFormRef = ref();
const rePwForm = ref({
  employeeName: "",
  pwd: "",
  confirmPwd: "",
});
const equalToPassword = (rule: any, value: any, callback: any) => {
  if (rePwForm.value.pwd !== value) {
    // console.log('两次输入的密码不一致');
    // upPwForm.confirmPwd=''
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const rules = reactive<any>({
  pwd: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPwd: [
    { required: true, trigger: "blur", message: "请再次输入您的密码" },
    { required: true, validator: equalToPassword, trigger: "blur" },
  ],
});
onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
  getOrgan();
  getRoleMeun();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

watch(
  () => searchName.value,
  (newdata) => {
    // console.log(newdata);
    if (newdata == "") {
      tableData1.value = tableData.value;
    } else {
      tableData1.value = table1(newdata);
    }
  }
);
const table1 = (newdata: any) => {
  let searchName = newdata.toLowerCase();
  return tableData.value.filter((v: any) => {
    return Object.keys(v).some((key) => {
      return String(v[key]).toLowerCase().indexOf(searchName) > -1;
    });
  });
};

const noRole = computed(() => {
  const data = optionArr.value.filter(
    (item: any) => !hasRole.value.some((ele) => ele.RoleID == item.value)
  );
  return data;
});

const getData = () => {
  getEmployee().then((data: any) => {
    dataPrecc(data.Data);
  });
};

const getOrgan = () => {
  getOrganization().then((data: any) => {
    if (data.Success) {
      // const dataText = JSON.parse(data.content);
      organTree.value = OrganData(data.Data);
      // console.log(organTree.value);
    }
  });
};

const OrganData = (organizations: any) => {
  const organizationMap = new Map();
  organizations.forEach((org: any) => {
    organizationMap.set(org.OrganizationId, { ...org, children: [] });
  });
  organizations.forEach((org: any) => {
    if (org.ParentOrganizationId !== null) {
      const parentOrg = organizationMap.get(org.ParentOrganizationId);
      if (parentOrg) {
        parentOrg.children.push(organizationMap.get(org.OrganizationId));
      }
    }
  });
  return Array.from(organizationMap.values()).filter(
    (org) => org.ParentOrganizationId === null
  );
};

const handleNodeClick = (data: any) => {
  // console.log(data)
  tableData1.value = table1(data.OrganizationId);
};
const refreshData = () => {
  isLoding.value = "is-loading";
  currentPage.value = 1;
  searchName.value = "";
  // tableData1.value = tableData.value
  getData();
  // getOrgan();
  let timer = setTimeout(() => {
    isLoding.value = "";
    clearTimeout(timer);
  }, 2000);
};

const getRoleMeun = () => {
  getAllRole().then((data: any) => {
    // const dataText = JSON.parse(data.content);
    optionArr.value =data.Data.map((item: any) => {
      return {
        value: item.id,
        lable: item.RoleName,
      };
    });
    // console.log(optionArr.value);
  });
  // console.log(optionArr.value);
};
const editCancel = () => {
  editVisible.value = false;
  editRef.value.resetFields();
};
const editSubmit = () => {
  addEmployee(editForm).then((data: any) => {
    if (data.Success) {
      getData();
      editVisible.value = false;
      ElNotification({
        title: "提示",
        message: "添加成功",
        type: "success",
      });
    }
  });
};

const getHasRole = () => {
  findEmployeeRoles(form.value.employeeName).then((data: any) => {
    if (data.Success) {
      //  console.log(data);
      if(data.content==null){
        hasRole.value=[]
        return
      }
      hasRole.value =data.Data;

    } else {
      ElNotification({
        title: "提示",
        message: data.msg,
        type: "error",
      });
    }
  });
};
const openAdd = () => {
  editVisible.value = true;
};
const dataPrecc = (data: any) => {
  // console.log(data);
  let beforeData = data; //将dataArr赋值给beforeData  也可直接操作dataArr
  let tempArr = [];
  let afterData = []; //新数组
  for (let i = 0; i < beforeData.length; i++) {
    if (tempArr.indexOf(beforeData[i].EmployeeId) === -1) {
      // console.log(beforeData[i].RoleName);
      afterData.push({
        employeeId: beforeData[i].EmployeeId,
        employeeName: beforeData[i].EmployeeName,
        fullName: beforeData[i].FullName,
        title: beforeData[i].title,
        OrganizationName: beforeData[i].OrganizationName,
        OrganizationID: beforeData[i].OrganizationID,
        RoleName:
          beforeData[i].RoleName == null ? [] : [beforeData[i].RoleName],
      });
      tempArr.push(beforeData[i].EmployeeId);
    } else {
      // console.log(1)
      for (let j = 0; j < afterData.length; j++) {
        if (
          afterData[j].employeeId == beforeData[i].EmployeeId &&
          beforeData[i].RoleName !== null
        ) {
          afterData[j].RoleName.push(beforeData[i].RoleName);
          break;
        }
      }
    }
  }
  // console.log(afterData);
  afterData.sort((a, b) => {
    return a.employeeName - b.employeeName;
  });
  // console.log(afterData);
  tableData.value = afterData;
  tableData1.value = tableData.value;
};

const handleEdit = (row: any) => {
  console.log(row);

  roleName.value = row.fullName;
  // form.value.roleId = row.RoleId;
  form.value.employeeName = row.employeeName;
  findEmployeeRoles(row.employeeName).then((data: any) => {
    if (data.Data == null ||data.Data == undefined) {
      hasRole.value = [];
    } else {
      hasRole.value =data.Data;
      // form.value.roleIdArr=data.content.map((d:any)=>d.RoleID)
      // console.log( hasRole.value);
    }
    addVisible.value = true;
  });
};
const addCancel = () => {
  addVisible.value = false;
};
const removeTag=(val:any)=>{
console.log(val);

}
const onSubmit = () => {
  form.value.roleId= form.value.roleIdArr.join(",")
  if (
    form.value.roleId == "" ||
    form.value.roleId == undefined ||
    form.value.roleId == null
  ) {
    addVisible.value = false;
    formRef.value.resetFields();
  } else {
    // console.log(form.value);

    addEmployeeRole(form.value).then((res:any) => {
      // getData();
      if(res.success){
        ElNotification({
            title: "提示",
            message: res.msg,
            type: "success",
          });
      }
      addVisible.value = false;
      formRef.value.resetFields();
    });
  }
};

const handleClose = (tag: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletefirstRole({
        EmpId: form.value.employeeName,
        RoleId: tag.RoleID,
      }).then((data: any) => {
        // console.log(data);
        if ((data.code = 100200)) {
          getHasRole();
          // getData();
          ElNotification({
            title: "提示",
            message: "删除成功",
            type: "success",
          });
        } else {
          ElNotification({
            title: "提示",
            message: "删除失败",
            type: "error",
          });
        }
      });
    })
    .catch(() => {
      ElNotification({
        title: "提示",
        message: "取消操作",
        type: "info",
      });
    });
};

const handleRest = (row: any) => {
  // console.log(row);
  rePwForm.value.employeeName = row.employeeName;
  restVisible.value = true;
};
const upDateCancel = () => {
  restVisible.value = false;
  reFormRef.value.resetFields();
};
const upDateSubmit = () => {
  reFormRef.value.validate((valid: any) => {
    if (valid) {
      let data = {
        employeeName: rePwForm.value.employeeName,
        pwd: rePwForm.value.pwd,
      };
      ResetPwd(data).then((res: any) => {
        // console.log(data)
        if (res.code == 100200) {
          ElNotification({
            title: "重置成功",
            // message: "取消操作",
            type: "success",
          });
        } else {
          ElNotification({
            title: "重置失败",
            message: res.msg,
            type: "error",
          });
        }
        restVisible.value = false;
      });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteEmployee(row.employeeId).then((data: any) => {
        if (data.Success) {
          // console.log()
          // getHasRole();
          getData();
          //  console.log(data);
          ElNotification({
            title: "删除成功",
            // message: "取消操作",
            type: "success",
          });
        } else {
          ElNotification({
            title: "删除失败",
            // message: "取消操作",
            type: "error",
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消操作",
      });
      //   ElNotification({
      //     title: "取消操作",
      //     // message: "取消操作",
      //     type: "info",
      //   });
    });
};
const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 196;
  });
};
const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      // console.log(acc,item);
      const calcLen = getTextWidth(item);

      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};
const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement("span");
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${12}px; font-family: Arial, sans-serif;`;
  html.innerText = str; // 去除字符串前后的空白字符
  document.body?.appendChild(html);

  const spanElement = html; // 无需再次查询，直接使用创建的元素
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};
</script>
<style scoped>
.el-pagination {
  justify-content: center;
}

.el-tag+.el-tag {
  margin-left: 10px;
}

.el-card ::v-deep .el-card__header {
  /* background-color: lightblue; */
  padding: calc(20px - 5px) 20px;
}
</style>
