<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2 flex justify-between">
        <div class="flex gap-2">
          <el-button type="primary" size="small" icon="User" @click="openEmployeeAdd">新增员工</el-button>
        </div>
        <div class="flex gap-2">
          <el-input v-model="keyword" clearable placeholder="工号或姓名" style="width: 260px" @keyup.enter="handleSearch"
            @clear="handleSearch">
            <template #append>
              <el-button type="primary" icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
      </div>

      <el-table v-loading="loading" size="small" :data="tableData" border :height="tableHeight" stripe
        :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="EmpCode" label="员工工号" min-width="160" />
        <el-table-column prop="EmpName" label="员工姓名" min-width="160" />
        <el-table-column label="数据来源" min-width="140">
          <template #default="{ row }">
            <span v-if="row.Source">{{ row.Source }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-tooltip content="新增用户" placement="top">
              <el-button type="primary" icon="Plus" size="small" 
                @click="handleAddUser(row)" />
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

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="新增员工" v-model="employeeAddVisible"
      width="420px" @close="resetEmployeeAdd">
      <el-form ref="employeeAddFormRef" :model="employeeAddForm" :rules="employeeAddRules" label-width="90px">
        <el-form-item label="员工工号" prop="EmpCode">
          <el-input v-model="employeeAddForm.EmpCode" maxlength="50" clearable placeholder="请输入员工工号" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="EmpName">
          <el-input v-model="employeeAddForm.EmpName" maxlength="50" clearable placeholder="请输入员工姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="employeeAddVisible = false">取消</el-button>
          <el-button type="primary" :loading="employeeSaving" @click="submitEmployeeAdd">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { addUser, getEmployeeList, saveEmployee } from "@/api/localAccounts";

// 员工列表（服务端分页）：只查看，不做修改和删除
const tableData = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const keyword = ref("");
const tableHeight = ref(0);

// 主表操作列：为指定员工新增用户
const addingEmpId = ref("");

// 手动新增员工
const employeeAddVisible = ref(false);
const employeeSaving = ref(false);
const employeeAddFormRef = ref();
const employeeAddForm = reactive({ EmpCode: "", EmpName: "" });
const employeeAddRules = reactive<any>({
  EmpCode: [{ required: true, message: "请输入员工工号", trigger: "blur" }],
  EmpName: [{ required: true, message: "请输入员工姓名", trigger: "blur" }],
});

const isSuccess = (res: any) =>
  !!res && (res.Success === true || res.Success === "true" || res.Code == 100200);

const getEmpId = (emp: any) => emp?.id ?? emp?.Id ?? "";

// 员工列表：加载或搜索
const loadEmployees = async () => {
  loading.value = true;
  try {
    const res: any = await getEmployeeList({
      keyword: keyword.value.trim() || undefined,
      page: page.value,
      pageSize: pageSize.value,
    });
    if (isSuccess(res)) {
      const items = res.Data?.Items || [];
      tableData.value = items;
      total.value = res.Data?.Total ?? items.length;
    } else {
      tableData.value = [];
      total.value = 0;
      ElMessage.error(res?.Message || "员工查询失败");
    }
  } catch (e) {
    tableData.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  page.value = 1;
  loadEmployees();
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  page.value = 1;
  loadEmployees();
};

const handlePageChange = (val: number) => {
  page.value = val;
  loadEmployees();
};

// 操作列：用该员工的 id 调用新增用户接口
const handleAddUser = (row: any) => {
  const empId = getEmpId(row);
  if (!empId) {
    ElMessage.warning("该员工缺少员工编号，无法新增用户");
    return;
  }
  const empText = `${row.EmpCode || ""} ${row.EmpName || ""}`.trim();
  ElMessageBox.confirm(`确定为员工「${empText}」新增用户？`, "新增用户", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      addingEmpId.value = empId;
      try {
        const res: any = await addUser({ EmpId: empId });
        if (isSuccess(res)) {
          ElMessage.success("新增成功");
          loadEmployees();
        } else {
          ElMessage.error(res?.Message || "新增失败");
        }
      } catch (e) {
        // 错误提示由请求拦截器统一处理
      } finally {
        addingEmpId.value = "";
      }
    })
    .catch(() => {
      // 取消操作
    });
};

const openEmployeeAdd = () => {
  employeeAddForm.EmpCode = "";
  employeeAddForm.EmpName = "";
  employeeAddVisible.value = true;
  nextTick(() => employeeAddFormRef.value?.clearValidate());
};

const resetEmployeeAdd = () => {
  employeeAddFormRef.value?.clearValidate();
};

const submitEmployeeAdd = () => {
  employeeAddFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    employeeSaving.value = true;
    try {
      const res: any = await saveEmployee({
        EmpCode: employeeAddForm.EmpCode.trim(),
        EmpName: employeeAddForm.EmpName.trim(),
      });
      if (isSuccess(res)) {
        ElMessage.success("新增成功");
        employeeAddVisible.value = false;
        keyword.value = "";
        page.value = 1;
        loadEmployees();
      } else {
        ElMessage.error(res?.Message || "新增失败");
      }
    } catch (e) {
      // 错误提示由请求拦截器统一处理
    } finally {
      employeeSaving.value = false;
    }
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
  loadEmployees();
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
