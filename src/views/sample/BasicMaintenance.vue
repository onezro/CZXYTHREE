<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center mb-2">
        <el-button type="primary" size="small" @click="openAdd">
          {{ $t("publicText.add") }}
        </el-button>
        <el-input v-model="searchName" style="width: 350px" clearable
          :placeholder="$t('sample.BasicMaintenance.searchPlaceholder')" @keyup.enter="searchData"
          @clear="clearData" size="small">
          <template #append>
            <el-button type="primary" :icon="Search" @click="searchData" />
          </template>
        </el-input>
      </div>

      <el-table ref="tableMasterRef" :data="paginatedData" border :height="tableHeight" style="width: 100%" size="small"
        stripe highlight-current-row tooltip-effect="dark">
        <el-table-column type="index" :label="$t('publicText.index')" width="55" align="center" fixed="left">
          <template #default="{ $index }">
            {{ $index + 1 + (currentPage - 1) * pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="Tool" :label="$t('sample.BasicMaintenance.sampleCode')"
          :min-width="getColumnWidth('Tool')" fixed="left"/>
        <el-table-column prop="Model" :label="$t('sample.BasicMaintenance.sampleType')"
          :min-width="getColumnWidth('Model')" fixed="left"/>
        <el-table-column prop="prono" :label="$t('sample.BasicMaintenance.productCode')"
          :min-width="getColumnWidth('prono')" />
        <el-table-column prop="proname" :label="$t('sample.BasicMaintenance.productName')"
          :min-width="getColumnWidth('proname')" />
        <el-table-column prop="pn_spec" :label="$t('sample.BasicMaintenance.productSpec')"
          :min-width="getColumnWidth('pn_spec')" />
        <el-table-column prop="SS_Content" :label="$t('sample.BasicMaintenance.sampleContent')"
          :min-width="getColumnWidth('SS_Content')" />
        <el-table-column prop="SS_Date" :label="$t('sample.BasicMaintenance.sampleDate')"
          :min-width="getColumnWidth('SS_Date')" />
        <el-table-column prop="SS_UpdateDate" :label="$t('sample.BasicMaintenance.refreshDate')"
          :min-width="getColumnWidth('SS_UpdateDate')" />
        <el-table-column prop="ExpireLong" :label="$t('sample.BasicMaintenance.validityPeriod')"
          :min-width="getColumnWidth('ExpireLong')">
          <template #default="{ row }">
            <span>{{ row.ExpireLong ? row.ExpireLong + $t('sample.BasicMaintenance.year') : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ExpireDate" :label="$t('sample.BasicMaintenance.expireDate')"
          :min-width="getColumnWidth('ExpireDate')">
          <template #default="{ row }">
            <span :class="{ 'text-red': isExpired(row.ExpireDate) }">{{ row.ExpireDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="SS_User" :label="$t('sample.BasicMaintenance.sampleUser')"
          :min-width="getColumnWidth('SS_User')" />
        <el-table-column prop="Dsc" :label="$t('sample.BasicMaintenance.remark')"
          :min-width="getColumnWidth('Dsc')" />
        <el-table-column fixed="right" :label="$t('publicText.operation')" width="120" align="center">
          <template #default="{ row }">
            <el-tooltip :content="$t('publicText.edit')" placement="top">
              <el-button type="primary" :icon="Edit" size="small" @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip :content="$t('publicText.delete')" placement="top">
              <el-button type="danger" :icon="Delete" size="small" @click="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty :description="$t('publicText.noData')" />
        </template>
      </el-table>

      <div style="margin-top: 8px">
        <el-pagination align="center" background size="small" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100, 150]" layout="total, sizes, prev, pager, next"
          :total="filteredData.length" />
      </div>
    </el-card>

    <el-dialog :title="$t('publicText.add')" v-model="dialogVisible" width="500px" :close-on-click-modal="false"
      @close="addCancel">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px" size="small">
        <el-form-item :label="$t('sample.BasicMaintenance.sampleCode')" prop="compid">
          <el-input v-model="addForm.compid" style="width: 350px;" :placeholder="$t('sample.BasicMaintenance.sampleCode')" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.sampleType')" prop="compname">
          <el-select v-model="addForm.compname" filterable style="width: 350px;"
            :placeholder="$t('publicText.pleaseSelect')">
            <el-option v-for="item in typeList" :key="item.ToolsMold" :label="item.ToolsMold"
              :value="item.ToolsMold" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.sampleContent')" prop="sS_Content">
          <el-input v-model="addForm.sS_Content" style="width: 350px;" :placeholder="$t('sample.BasicMaintenance.sampleContent')" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.sampleDate')" prop="sS_Date">
          <el-date-picker v-model="addForm.sS_Date" type="date" :placeholder="$t('publicText.selectDate')"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.refreshDate')" prop="sS_UpdateDate">
          <el-date-picker v-model="addForm.sS_UpdateDate" type="date" @change="addChangeDate"
            :placeholder="$t('publicText.selectDate')" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.validityPeriod')" prop="expireLong">
          <el-input v-model="addForm.expireLong" disabled style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.expireDate')" prop="expirationDate">
          <el-input v-model="addForm.expirationDate" disabled style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.sampleUser')" prop="sS_User">
          <el-input v-model="addForm.sS_User" style="width: 350px;" :placeholder="$t('sample.BasicMaintenance.sampleUser')" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.remark')" prop="remark">
          <el-input v-model="addForm.remark" style="width: 350px;" :placeholder="$t('sample.BasicMaintenance.remark')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t("publicText.cancel") }}</el-button>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">{{ $t("publicText.confirm") }}</el-button>
      </template>
    </el-dialog>

    <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="500px" :close-on-click-modal="false">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px" size="small">
        <el-form-item :label="$t('sample.BasicMaintenance.sampleCode')" prop="compid">
          <el-input v-model="editForm.compid" disabled style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.sampleType')" prop="compname">
          <el-select v-model="editForm.compname" filterable style="width: 350px;"
            :placeholder="$t('publicText.pleaseSelect')">
            <el-option v-for="item in typeList" :key="item.ToolsMold" :label="item.ToolsMold"
              :value="item.ToolsMold" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.sampleContent')" prop="sS_Content">
          <el-input v-model="editForm.sS_Content" style="width: 350px;" :placeholder="$t('sample.BasicMaintenance.sampleContent')" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.sampleDate')" prop="sS_Date">
          <el-date-picker v-model="editForm.sS_Date" type="date" :placeholder="$t('publicText.selectDate')"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.refreshDate')" prop="sS_UpdateDate">
          <el-date-picker v-model="editForm.sS_UpdateDate" type="date" @change="editChangeDate"
            :placeholder="$t('publicText.selectDate')" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.validityPeriod')" prop="expireLong">
          <el-input v-model="editForm.expireLong" disabled style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.expireDate')" prop="expirationDate">
          <el-input v-model="editForm.expirationDate" disabled style="width: 350px;" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.sampleUser')" prop="sS_User">
          <el-input v-model="editForm.sS_User" style="width: 350px;" :placeholder="$t('sample.BasicMaintenance.sampleUser')" />
        </el-form-item>
        <el-form-item :label="$t('sample.BasicMaintenance.remark')" prop="remark">
          <el-input v-model="editForm.remark" style="width: 350px;" :placeholder="$t('sample.BasicMaintenance.remark')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">{{ $t("publicText.cancel") }}</el-button>
        <el-button type="primary" @click="onEditSubmit" :loading="submitLoading">{{ $t("publicText.confirm") }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Edit, Delete } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { queryToolsMold, queryToolsID, insertToolsID, updateToolsID, deleteToolsID } from "@/api/deviceManage/fixture";
import dayjs from "dayjs";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useUserStoreWithOut } from "@/stores/modules/user";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const tableMasterRef = ref();
const tableData = ref<any[]>([]);
const filteredData = ref<any[]>([]);
const tableHeight = ref(0);
const currentPage = ref(1);
const pageSize = ref(50);
const searchName = ref("");
const typeList = ref<any[]>([]);
const submitLoading = ref(false);

const { getColumnWidth } = useTableColumnWidth(tableMasterRef, filteredData, {
  excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.value.slice(start, end);
});

const dialogVisible = ref(false);
const addFormRef = ref();
const addForm = reactive({
  compid: "",
  sS_Date: "",
  sS_Content: "",
  compname: "",
  sS_User: "",
  sS_UpdateDate: "",
  remark: "",
  expireLong: "1",
  expireUnit: "Y",
  expirationDate: "",
  user: userStore.getUserInfo,
  selectType: ["3"],
});

const addRules = {
  compid: [{ required: true, message: t("message.pleaseInput") + t("sample.BasicMaintenance.sampleCode"), trigger: "blur" }],
  compname: [{ required: true, message: t("message.pleaseSelect") + t("sample.BasicMaintenance.sampleType"), trigger: "change" }],
};

const editVisible = ref(false);
const editFormRef = ref();
const editForm = reactive({
  compid: "",
  sS_Date: "",
  compname: "",
  sS_Content: "",
  sS_User: "",
  sS_UpdateDate: "",
  remark: "",
  expireLong: "1",
  expireUnit: "Y",
  expirationDate: "",
  user: userStore.getUserInfo,
  selectType: ["3"],
});

const editRules = {
  compname: [{ required: true, message: t("message.pleaseSelect") + t("sample.BasicMaintenance.sampleType"), trigger: "change" }],
};

const getData = async () => {
  try {
    const res: any = await queryToolsID({ ...getForm, operationType: "Q" });
    if (res.Success) {
      tableData.value = res.Data;
      filteredData.value = res.Data.map((item: any) => ({
        ...item,
        SS_Date: item.SS_Date ? dayjs(item.SS_Date).format("YYYY-MM-DD") : "",
        ExpireDate: item.ExpireDate ? dayjs(item.ExpireDate).format("YYYY-MM-DD") : "",
      }));
    } else {
      tableData.value = [];
      filteredData.value = [];
    }
  } catch (error) {
    ElMessage.error(t("message.queryFailure"));
  }
};

const getForm = reactive({
  operationType: "",
  compid: "*",
  compname: "",
  remark: "",
  user: "",
  expirationDate: "",
  selectType: ["3"],
});

const getIdData = async () => {
  try {
    const res: any = await queryToolsMold({
      toolsMold: "*",
      remark: "",
      operationType: "Q",
    });
    typeList.value = res.Data.filter((item: any) => item.Category == "3");
  } catch (error) {
    console.error("获取类型列表失败:", error);
  }
};

const searchData = () => {
  if (!searchName.value.trim()) {
    filteredData.value = [...tableData.value];
  } else {
    const keyword = searchName.value.toLowerCase();
    filteredData.value = tableData.value.filter((v) => {
      return (
        (v.Tool && String(v.Tool).toLowerCase().indexOf(keyword) > -1) ||
        (v.Model && String(v.Model).toLowerCase().indexOf(keyword) > -1)
      );
    });
  }
  currentPage.value = 1;
};

const clearData = () => {
  searchName.value = "";
  filteredData.value = [...tableData.value];
  currentPage.value = 1;
};

const openAdd = () => {
  getIdData();
  dialogVisible.value = true;
};

const addChangeDate = () => {
  if (!addForm.sS_UpdateDate) return;
  const [year, month, day] = addForm.sS_UpdateDate.split("-");
  const newYear = Number(year) + Number(addForm.expireLong);
  addForm.expirationDate = `${newYear}-${month}-${day}`;
};

const editChangeDate = () => {
  if (!editForm.sS_UpdateDate) return;
  const [year, month, day] = editForm.sS_UpdateDate.split("-");
  const newYear = Number(year) + Number(editForm.expireLong);
  editForm.expirationDate = `${newYear}-${month}-${day}`;
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    t("message.confirmDelete", { code: row.Tool, name: row.Model }),
    t("publicText.tip"),
    { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
  )
    .then(async () => {
      try {
        const data = {
          operationType: "D",
          compid: row.Tool,
          compname: row.Model,
          remark: "",
          user: userStore.getUserInfo,
        };
        const res: any = await deleteToolsID(data);
        if (res.Success) {
          ElMessage.success(t("message.deleteSuccess"));
          if (filteredData.value.length === 1 && currentPage.value > 1) currentPage.value--;
          await getData();
        } else {
          ElMessage.error(res.data.Message || t("message.deleteFailure"));
        }
      } catch (error) {
        ElMessage.error(t("message.deleteFailure"));
      }
    })
    .catch(() => {
      ElMessage.info(t("publicText.cancel"));
    });
};

const onSubmit = async () => {
  try {
    await addFormRef.value.validate();
    submitLoading.value = true;
    const res: any = await insertToolsID({ ...addForm, operationType: "I" });
    if (res.Success) {
      ElMessage.success(t("message.addSuccess"));
      dialogVisible.value = false;
      addCancel();
      await getData();
    } else {
      ElMessage.error(res.Message || t("message.addFailure"));
    }
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

const addCancel = () => {
  addFormRef.value?.resetFields();
  Object.assign(addForm, {
    compid: "",
    sS_Date: "",
    sS_Content: "",
    compname: "",
    sS_User: "",
    sS_UpdateDate: "",
    remark: "",
    expireLong: "1",
    expireUnit: "Y",
    expirationDate: "",
    user: userStore.getUserInfo,
    selectType: ["3"],
  });
};

const handleEdit = (row: any) => {
  getIdData();
  editForm.compid = row.Tool;
  editForm.sS_Date = row.SS_Date;
  editForm.compname = row.Model;
  editForm.sS_Content = row.SS_Content;
  editForm.sS_User = row.SS_User;
  editForm.sS_UpdateDate = row.SS_UpdateDate;
  editForm.remark = row.Dsc || "";
  editForm.expireLong = row.ExpireLong ? row.ExpireLong : "1";
  editForm.expireUnit = row.ExpireUnit ? row.expireUnit : "Y";
  editForm.expirationDate = row.ExpireDate;
  editChangeDate();
  editVisible.value = true;
};

const onEditSubmit = async () => {
  try {
    await editFormRef.value.validate();
    submitLoading.value = true;
    const res: any = await updateToolsID({ ...editForm, operationType: "U" });
    if (res.Success) {
      ElMessage.success(t("message.editSuccess"));
      editVisible.value = false;
      await getData();
    } else {
      ElMessage.error(res.Message || t("message.editFailure"));
    }
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

const isExpired = (dateStr: string) => {
  if (!dateStr) return false;
  const now = new Date();
  const target = new Date(dateStr + "T00:00:00");
  return now >= target;
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

onMounted(() => {
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
  getData();
  getIdData();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.el-pagination {
  justify-content: center;
}

.text-red {
  color: #f56c6c;
}
</style>