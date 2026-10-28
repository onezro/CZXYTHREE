<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2 flex justify-between">
        <el-button type="primary" size="small" icon="Plus" @click="openAdd">新增账号</el-button>
        <div class="flex gap-2">
          <el-input v-model="keyword" clearable placeholder="姓名" style="width: 260px" @keyup.enter="handleSearch"
            @clear="handleSearch">
            <template #append>
              <el-button type="primary" icon="Search" @click="handleSearch" />
            </template>
          </el-input>
          <el-button icon="Refresh" @click="loadAccounts" />
        </div>
      </div>

      <el-table v-loading="loading" size="small" :data="tableData" border :height="tableHeight" stripe row-key="ID"
        :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="EmployeeName" label="登录账号" min-width="130" />
        <el-table-column prop="FullName" label="姓名" min-width="100" />
        <el-table-column label="关联员工" min-width="170">
          <template #default="{ row }">
            <span v-if="row.EmpId">{{ row.EmpCode }} {{ row.EmpName }}</span>
            <span v-else class="text-gray-400">未关联</span>
          </template>
        </el-table-column>
        <el-table-column label="员工状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.EmpStatus === '0'" type="success" size="small">在职</el-tag>
            <el-tag v-else-if="row.EmpStatus === '1'" type="info" size="small">离职</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="启用" width="80" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.CanLogin === true" :loading="row._switching"
              @change="(val: any) => handleToggleLogin(row, val)" />
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="190">
          <template #default="{ row }">
            <el-tag v-for="id in row.RoleIds || []" :key="id" effect="plain" size="small" class="mr-1 mb-1">
              {{ roleNameMap[id] || id }}
            </el-tag>
            <span v-if="!row.RoleIds || row.RoleIds.length === 0" class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="初始密码" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.IsInitPassword" type="warning" size="small">是</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="210" align="center">
          <template #default="{ row }">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" icon="EditPen" size="small" @click="openEdit(row)" />
            </el-tooltip>
            <el-tooltip content="重置密码" placement="top">
              <el-button type="warning" icon="Key" size="small" @click="openReset(row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="Delete" size="small" @click="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-2">
        <el-pagination background size="small" :current-page="page" :page-size="pageSize" :page-sizes="[20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
          @current-change="handlePageChange" />
      </div>
    </el-card>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" :title="isEdit ? '编辑账号' : '新增账号'"
      v-model="editVisible" width="520px" @close="resetEditForm">
      <el-form ref="editFormRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="员工" prop="EmpId">
          <div style="width: 100%">
            <el-input v-model="empKeyword" clearable placeholder="输入工号或姓名，回车查询" @keyup.enter="queryEmployee"
              @input="handleEmpInput">
             
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="登录账号" prop="EmployeeName">
          <el-input v-model="form.EmployeeName" :disabled="isEdit" maxlength="50" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item label="密码" prop="Password">
          <el-input v-model="form.Password" type="password" show-password
            :placeholder="isEdit ? '留空表示不修改密码' : '至少8个字符'" />
        </el-form-item>
        <el-form-item label="启用" prop="CanLogin">
          <el-switch v-model="form.CanLogin" />
        </el-form-item>
        <el-form-item label="角色" prop="RoleIds">
          <el-select v-model="form.RoleIds" multiple filterable placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in roleOptions" :key="role.ID" :label="role.RoleName" :value="role.ID" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取消</el-button>
          <el-button type="primary" :loading="saving" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="重置密码" v-model="resetVisible" width="420px"
      @close="resetPasswordForm">
      <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" label-width="90px">
        <el-form-item label="登录账号">
          <el-input :model-value="resetRow.EmployeeName" disabled />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="resetForm.newPwd" type="password" show-password placeholder="至少8个字符" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="resetForm.confirmPwd" type="password" show-password placeholder="再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetVisible = false">取消</el-button>
          <el-button type="primary" :loading="resetting" @click="submitReset">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  deleteAccount,
  getAccountList,
  getAccountRoles,
  getEmployeeList,
  saveAccount,
} from "@/api/localAccounts";

interface RoleOption {
  ID: string;
  RoleName: string;
}

const tableData = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const keyword = ref("");
const tableHeight = ref(0);

const roleOptions = ref<RoleOption[]>([]);
const roleNameMap = ref<Record<string, string>>({});

const editVisible = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const editFormRef = ref();
const form = reactive({
  Id: "",
  EmployeeName: "",
  EmpId: "",
  Password: "",
  CanLogin: true,
  RoleIds: [] as string[],
});

const empKeyword = ref("");
const empLoading = ref(false);
const currentEmpSeed = ref<any>(null);

const resetVisible = ref(false);
const resetting = ref(false);
const resetFormRef = ref();
const resetRow = ref<any>({});
const resetForm = reactive({
  newPwd: "",
  confirmPwd: "",
});

const getUtf8ByteLength = (value: string) => new TextEncoder().encode(value).length;

const isSuccess = (res: any) =>
  !!res && (res.Success === true || res.Success === "true" || res.Code == 100200);

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    if (isEdit.value) {
      callback();
    } else {
      callback(new Error("请输入密码"));
    }
    return;
  }
  if (value.length < 8) {
    callback(new Error("密码至少8个字符"));
    return;
  }
  if (getUtf8ByteLength(value) > 72) {
    callback(new Error("密码长度不能超过72字节"));
    return;
  }
  callback();
};

const validateEmpId = (rule: any, value: string, callback: any) => {
  if (!isEdit.value && !value) {
    callback(new Error("请输入员工并按回车查询"));
    return;
  }
  callback();
};

const formRules = reactive<any>({
  EmployeeName: [
    { required: true, message: "请输入登录账号", trigger: "blur" },
    { max: 50, message: "最多50个字符", trigger: "blur" },
  ],
  // EmpId: [{ validator: validateEmpId, trigger: "change" }],
  Password: [{ validator: validatePassword, trigger: "blur" }],
});

const validateResetPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请输入新密码"));
    return;
  }
  if (value.length < 8) {
    callback(new Error("密码至少8个字符"));
    return;
  }
  if (getUtf8ByteLength(value) > 72) {
    callback(new Error("密码长度不能超过72字节"));
    return;
  }
  callback();
};

const equalToPassword = (rule: any, value: string, callback: any) => {
  if (resetForm.newPwd !== value) {
    callback(new Error("两次输入的密码不一致"));
    return;
  }
  callback();
};

const resetRules = reactive<any>({
  newPwd: [{ required: true, validator: validateResetPassword, trigger: "blur" }],
  confirmPwd: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    { validator: equalToPassword, trigger: "blur" },
  ],
});

const loadAccounts = async () => {
  loading.value = true;
  try {
    const res: any = await getAccountList({
      keyword: keyword.value.trim() || undefined,
      page: page.value,
      pageSize: pageSize.value,
    });
    if (isSuccess(res)) {
      tableData.value = res.Data?.Items || [];
      total.value = res.Data?.Total || 0;
    } else {
      tableData.value = [];
      total.value = 0;
      ElMessage.error(res?.Message || "账号查询失败");
    }
  } catch (e) {
    tableData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const loadRoles = async () => {
  try {
    const res: any = await getAccountRoles();
    if (isSuccess(res)) {
      roleOptions.value = res.Data || [];
      const map: Record<string, string> = {};
      roleOptions.value.forEach((role: RoleOption) => {
        map[role.ID] = role.RoleName;
      });
      roleNameMap.value = map;
    } else {
      ElMessage.error(res?.Message || "角色查询失败");
    }
  } catch (e) {
    roleOptions.value = [];
  }
};

// 回车查询员工：查询到可关联员工后带出登录账号
const queryEmployee = async () => {
  const keyword = empKeyword.value.trim();
  if (!keyword) {
    ElMessage.warning("请输入工号或姓名");
    return;
  }
  empLoading.value = true;
  try {
    const res: any = await getEmployeeList({
      keyword,
      page: 1,
      pageSize: 20,
    });
    if (!isSuccess(res)) {
      ElMessage.error(res?.Message || "员工查询失败");
      return;
    }
    const list = res.Data?.Items || [];
    const eligible = list.filter(
      (emp: any) =>
        (emp.Status === "0" && !emp.AccountName) ||
        (!!form.EmpId && emp.Id === form.EmpId)
    );
    if (eligible.length === 0) {
      ElMessage.warning("未查询到可关联的员工");
      return;
    }
    const emp = eligible[0];
    form.EmpId = emp.Id;
    currentEmpSeed.value = emp;
    empKeyword.value = `${emp.EmpCode || ""} ${emp.EmpName || ""}`.trim();
    // 新增账号时用员工姓名带出登录账号；编辑时账号名称不允许修改
    if (!isEdit.value) {
      form.EmployeeName = emp.EmpName || "";
    }
    editFormRef.value?.clearValidate("EmpId");
    if (eligible.length > 1) {
      ElMessage.info(`匹配到 ${eligible.length} 名员工，已带出 ${emp.EmpName}`);
    }
  } catch (e) {
    // 错误提示由请求拦截器统一处理
  } finally {
    empLoading.value = false;
  }
};

// 手动修改员工输入内容时，解除上一次的匹配，避免绑错员工
const handleEmpInput = () => {
  if (!currentEmpSeed.value) return;
  const matchedText = `${currentEmpSeed.value.EmpCode || ""} ${currentEmpSeed.value.EmpName || ""}`.trim();
  if (empKeyword.value !== matchedText) {
    form.EmpId = "";
    currentEmpSeed.value = null;
  }
};

const handleSearch = () => {
  page.value = 1;
  loadAccounts();
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  page.value = 1;
  loadAccounts();
};

const handlePageChange = (val: number) => {
  page.value = val;
  loadAccounts();
};

const openAdd = () => {
  isEdit.value = false;
  form.Id = "";
  form.EmployeeName = "";
  form.EmpId = "";
  form.Password = "12345678";
  form.CanLogin = true;
  form.RoleIds = [];
  currentEmpSeed.value = null;
  empKeyword.value = "";
  editVisible.value = true;
  nextTick(() => editFormRef.value?.clearValidate());
};

const openEdit = (row: any) => {
  isEdit.value = true;
  form.Id = row.ID;
  form.EmployeeName = row.EmployeeName;
  form.EmpId = row.EmpId || "";
  form.Password = "";
  form.CanLogin = row.CanLogin === true;
  form.RoleIds = [...(row.RoleIds || [])];
  currentEmpSeed.value = row.EmpId
    ? {
        Id: row.EmpId,
        EmpCode: row.EmpCode,
        EmpName: row.EmpName,
        Status: row.EmpStatus,
        AccountName: row.EmployeeName,
      }
    : null;
  empKeyword.value = currentEmpSeed.value
    ? `${currentEmpSeed.value.EmpCode || ""} ${currentEmpSeed.value.EmpName || ""}`.trim()
    : "";
  editVisible.value = true;
  nextTick(() => editFormRef.value?.clearValidate());
};

const resetEditForm = () => {
  editFormRef.value?.clearValidate();
  currentEmpSeed.value = null;
  empKeyword.value = "";
};

const submitForm = () => {
  editFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    saving.value = true;
    try {
      const payload: any = {
        EmployeeName: form.EmployeeName,
        CanLogin: form.CanLogin,
        RoleIds: form.RoleIds,
      };
      if (form.EmpId) {
        payload.EmpId = form.EmpId;
      }
      if (form.Id) {
        payload.Id = form.Id;
      }
      if (form.Password) {
        payload.Password = form.Password;
      }
      const res: any = await saveAccount(payload);
      if (isSuccess(res)) {
        ElMessage.success(form.Id ? "保存成功" : "新增成功");
        editVisible.value = false;
        loadAccounts();
      } else {
        ElMessage.error(res?.Message || "保存失败");
      }
    } catch (e) {
      // 错误提示由请求拦截器统一处理
    } finally {
      saving.value = false;
    }
  });
};

const handleToggleLogin = async (row: any, val: any) => {
  row._switching = true;
  try {
    const payload: any = {
      Id: row.ID,
      EmployeeName: row.EmployeeName,
      CanLogin: val === true,
    };
    if (row.EmpId) {
      payload.EmpId = row.EmpId;
    }
    const res: any = await saveAccount(payload);
    if (isSuccess(res)) {
      ElMessage.success(val === true ? "账号已启用" : "账号已停用");
      loadAccounts();
    } else {
      ElMessage.error(res?.Message || "操作失败");
    }
  } catch (e) {
    // 错误提示由请求拦截器统一处理
  } finally {
    row._switching = false;
  }
};

const openReset = (row: any) => {
  resetRow.value = row;
  resetForm.newPwd = "";
  resetForm.confirmPwd = "";
  resetVisible.value = true;
  nextTick(() => resetFormRef.value?.clearValidate());
};

const resetPasswordForm = () => {
  resetFormRef.value?.clearValidate();
};

const submitReset = () => {
  resetFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    resetting.value = true;
    try {
      const row = resetRow.value;
      const payload: any = {
        Id: row.ID,
        EmployeeName: row.EmployeeName,
        CanLogin: row.CanLogin === true,
        Password: resetForm.newPwd,
      };
      if (row.EmpId) {
        payload.EmpId = row.EmpId;
      }
      const res: any = await saveAccount(payload);
      if (isSuccess(res)) {
        ElMessage.success("密码重置成功");
        resetVisible.value = false;
        loadAccounts();
      } else {
        ElMessage.error(res?.Message || "密码重置失败");
      }
    } catch (e) {
      // 错误提示由请求拦截器统一处理
    } finally {
      resetting.value = false;
    }
  });
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除账号「${row.EmployeeName}」？`, "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const res: any = await deleteAccount({
          EmployeeName: row.EmployeeName,
        });
        if (isSuccess(res)) {
          ElMessage.success("删除成功");
          if (tableData.value.length === 1 && page.value > 1) {
            page.value -= 1;
          }
          loadAccounts();
        } else {
          ElMessage.error(res?.Message || "删除失败");
        }
      } catch (e) {
        // 错误提示由请求拦截器统一处理
      }
    })
    .catch(() => {
      // 取消操作
    });
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

onMounted(() => {
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
  loadRoles();
  loadAccounts();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
