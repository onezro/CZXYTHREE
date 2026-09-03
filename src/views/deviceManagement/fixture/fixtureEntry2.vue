<template>
  <div class="p-1">
    <el-card shadow="never" :body-style="{ padding: '6px 8px' }">
      <div class="flex justify-between items-center flex-wrap gap-y-1 mb-1">
        <!-- 左：操作按钮组 -->
        <div class="flex items-center flex-wrap gap-2">
          <el-button type="primary" size="small" @click="addOpen">
            {{ $t("publicText.add") }}
          </el-button>
          <el-button type="info" size="small" :disabled="selectedRows.length === 0"
            @click="handleClearCell">
            {{ $t("deviceManage.fixtureEntry.clearCell") }}
          </el-button>
        </div>
        <!-- 右：搜索框 -->
        <div class="input_box">
          <el-input v-model="searchName" style="width: 350px" clearable
            :placeholder="$t('deviceManage.fixtureEntry.searchPlaceholder')" @keyup.enter="searchData"
            @clear="clearData" size="small">
            <template #append>
              <el-button type="primary" icon="Search" @click="searchData" />
            </template>
          </el-input>
        </div>
      </div>

      <el-table ref="tableRef" :data="tableData" border :height="tableHeight" style="width: 100%" size="small" stripe
        highlight-current-row tooltip-effect="dark" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center" fixed="left" />
        <el-table-column type="index" :label="$t('publicText.index')" width="55" align="center" fixed="left">
          <template #default="{ $index }">
            {{ $index + 1 + (currentPage - 1) * pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="Tool" :label="$t('deviceManage.fixtureEntry.toolCode')"
          :min-width="getColumnWidth('Tool')" />
        <el-table-column prop="Model" :label="$t('deviceManage.fixtureEntry.toolType')"
          :min-width="getColumnWidth('Model')" />
        <el-table-column prop="MaterialName" :label="$t('deviceManage.fixtureEntry.typeDescription')"
          :min-width="getColumnWidth('MaterialName')" />
        <el-table-column prop="Cell" :label="$t('deviceManage.fixtureEntry.cell')" width="100"
          :min-width="getColumnWidth('Cell')" />
        <el-table-column prop="Dsc" :label="$t('deviceManage.fixtureEntry.description')" width="200"
          show-overflow-tooltip :min-width="getColumnWidth('Dsc')" />
        <el-table-column prop="Stts" :label="$t('deviceManage.fixtureEntry.status')" width="100" align="center"
          :min-width="getColumnWidth('Stts')">
          <template #default="{ row }">
            <el-tag :type="tagType(row.Stts)">
              {{ tagText(row.Stts) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ExpireDate" :label="$t('deviceManage.fixtureEntry.expireDate')" width="155"
          :min-width="getColumnWidth('ExpireDate')">
          <template #default="{ row }">
            <span :class="{ 'text-red': isExpired(row.ExpireDate) }">
              {{ row.ExpireDate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="Ud_user" :label="$t('deviceManage.fixtureEntry.operator')" width="125"
          :min-width="getColumnWidth('Ud_user')" />
        <el-table-column prop="Ud_dt" :label="$t('deviceManage.fixtureEntry.operateTime')" width="155"
          :min-width="getColumnWidth('Ud_dt')" />
        <el-table-column fixed="right" :label="$t('publicText.operation')" width="240" align="center">
          <template #default="{ row }">
            <el-tooltip :content="$t('publicText.edit')" placement="top">
              <el-button type="primary" icon="Edit" size="small" :disabled="row.Stts === -1" @click="handleEdit(row)" />
            </el-tooltip>
            <el-tooltip :content="$t('deviceManage.fixtureEntry.scrap')" placement="top">
              <el-button type="warning" icon="DocumentDelete" size="small" :disabled="row.Stts === -1"
                @click="handleScrap(row)" />
            </el-tooltip>
            <el-tooltip :content="$t('publicText.delete')" placement="top">
              <el-button type="danger" icon="Delete" size="small" @click="handleDelete(row)" />
            </el-tooltip>
            <el-tooltip :content="$t('publicText.detail')" placement="top">
              <el-button type="success" icon="Document" size="small" :disabled="row.Stts === -1"
                @click="handleDetail(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty :description="$t('publicText.noData')" />
        </template>
      </el-table>

      <div style="margin-top: 4px">
        <el-pagination align="center" background size="small" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next" :total="total" />
      </div>
    </el-card>

    <!-- 新增对话框 -->
    <el-dialog :title="$t('publicText.add')" v-model="addVisible" width="500px" :close-on-click-modal="false"
      @close="addCancel">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="auto" size="small">
        <el-form-item :label="$t('deviceManage.fixtureEntry.toolCode')" prop="compid">
          <el-input v-model="addForm.compid" style="width: 350px"
            :placeholder="$t('deviceManage.fixtureEntry.toolCodePlaceholder')" clearable />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.toolType')" prop="compname">
          <el-select-v2 v-model="addForm.compname" filterable style="width: 350px" :options="typeList" :props="props"
            :placeholder="$t('deviceManage.fixtureEntry.toolTypePlaceholder')" clearable @change="handleTypeChange">

            <template #default="{ item }">
              <el-tooltip :content="getCategoryText(item.Category)" placement="top">
                <span>{{ item.ToolsMold }}</span>
              </el-tooltip>
            </template>
          </el-select-v2>
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.category')" prop="fixtureCategory">
          <el-input v-model="fixtureCategory" style="width: 350px" disabled />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.typeDescription')" prop="remark">
          <el-input v-model="addForm.remark" style="width: 350px" disabled />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.expireDate')" prop="expirationDate">
          <el-date-picker v-model="addForm.expirationDate" style="width: 350px" type="date"
            :placeholder="$t('publicText.selectDate')" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addCancel">{{ $t("publicText.cancel") }}</el-button>
        <el-button type="primary" @click="addSubmit" :loading="submitLoading">{{ $t("publicText.confirm") }}</el-button>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog :title="$t('publicText.edit')" v-model="editVisible" width="500px" :close-on-click-modal="false"
      @close="editCancel">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="auto" size="small">
        <el-form-item :label="$t('deviceManage.fixtureEntry.toolCode')" prop="compid">
          <el-input v-model="editForm.compid" disabled style="width: 350px" />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.toolType')" prop="compname">
          <el-select-v2 v-model="editForm.compname" filterable style="width: 350px" :options="typeList"
            label-field="ToolsMold" value-field="ToolsMold"
            :placeholder="$t('deviceManage.fixtureEntry.toolTypePlaceholder')" clearable @change="handleEditTypeChange">
            <template #item-template="{ option }">
              <el-tooltip :content="getCategoryText(option.Category)" placement="top">
                <span>{{ option.ToolsMold }}</span>
              </el-tooltip>
            </template>
          </el-select-v2>
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.category')" prop="fixtureCategory">
          <el-input v-model="fixtureCategoryEdit" style="width: 350px" disabled />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.description')" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" style="width: 350px"
            :placeholder="$t('deviceManage.fixtureEntry.descriptionPlaceholder')" clearable />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.expireDate')" prop="expirationDate">
          <el-date-picker v-model="editForm.expirationDate" style="width: 350px" type="date"
            :placeholder="$t('publicText.selectDate')" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editCancel">{{ $t("publicText.cancel") }}</el-button>
        <el-button type="primary" @click="editSubmit" :loading="submitLoading">{{ $t("publicText.confirm")
        }}</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog :title="$t('publicText.detail')" v-model="detailVisible" width="800px" :close-on-click-modal="false">
      <el-form :model="detailForm" :inline="true" label-width="auto" size="small">
        <el-form-item :label="$t('deviceManage.fixtureEntry.toolCode')">
          <el-input v-model="detailForm.CompID" disabled style="width: 240px" />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.toolType')">
          <el-input v-model="detailForm.CompName" disabled style="width: 240px" />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.usedTimes')">
          <el-input v-model.number="detailForm.Uses" disabled style="width: 240px" />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.totalUsesLimit')">
          <el-input v-model.number="detailForm.TotalUses" disabled style="width: 240px" />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.initialDate')">
          <el-input v-model="detailForm.InitialDate" disabled style="width: 240px" />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.maintainDate')">
          <el-input v-model="detailForm.MaintDate" disabled style="width: 240px" />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureEntry.cleanStatus')">
          <div>{{ getCleanStatusText(detailForm.CleanStatus) }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">{{ $t("publicText.confirm") }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from "vue";
// computed 仍用于 tableColumns 和 columnWidths
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { queryToolsMold, queryToolsID, insertToolsID, updateToolsID, deleteToolsID, scrapToolsID, queryAssetToolsID, CancelRackTask } from "@/api/deviceManage/fixture";
import dayjs from "dayjs";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useUserStoreWithOut } from "@/stores/modules/user";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

// ---------- 表格数据 ----------
const props = {
  label: 'ToolsMold',
  value: 'ToolsMold',
}
const tableRef = ref();
const tableData = ref<any[]>([]);
const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const currentPage = ref(1);
const pageSize = ref(50);
const searchName = ref("");
const total = ref(0);
const selectedRows = ref<any[]>([]);

// 类型列表（工治具类别）
const typeList = ref<any[]>([]);

// 类别选项映射（用于显示文本）
const categoryMap = [
  { Value: "1", Text: t("deviceManage.fixtureType.printFixture") },
  { Value: "2", Text: t("deviceManage.fixtureType.ictFixture") },
  // { Value: "3", Text: t("deviceManage.fixtureType.sample") },
];

const getCategoryText = (value: string) => {
  const found = categoryMap.find(item => item.Value === value);
  return found ? found.Text : "";
};

// ---------- 动态列宽 ----------
const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

// ---------- 新增表单 ----------
const addVisible = ref(false);
const addFormRef = ref();
const addForm = reactive({
  operationType: "I",
  compid: "",
  compname: "",
  remark: "",
  user: userStore.getUserInfo,
  expirationDate: "",
});
const fixtureCategory = ref(""); // 显示类别

const addRules = {
  compid: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.fixtureEntry.toolCode"), trigger: "blur" }],
  compname: [{ required: true, message: t("message.pleaseSelect") + t("deviceManage.fixtureEntry.toolType"), trigger: "change" }],
};

// 选择工治具类别后自动填充描述和类别
const handleTypeChange = (value: string) => {
  const selected = typeList.value.find(item => item.ToolsMold === value);
  if (selected) {
    addForm.remark = selected.MaterialName || "";
    fixtureCategory.value = getCategoryText(selected.Category);
  } else {
    addForm.remark = "";
    fixtureCategory.value = "";
  }
};

// ---------- 编辑表单 ----------
const editVisible = ref(false);
const editFormRef = ref();
const editForm = reactive({
  operationType: "U",
  compid: "",
  compname: "",
  remark: "",
  user: userStore.getUserInfo,
  expirationDate: "",
});
const fixtureCategoryEdit = ref("");

const editRules = {
  compname: [{ required: true, message: t("message.pleaseSelect") + t("deviceManage.fixtureEntry.toolType"), trigger: "change" }],
};

const handleEditTypeChange = (value: string) => {
  const selected = typeList.value.find(item => item.ToolsMold === value);
  if (selected) {
    editForm.remark = selected.MaterialName || "";
    fixtureCategoryEdit.value = getCategoryText(selected.Category);
  } else {
    editForm.remark = "";
    fixtureCategoryEdit.value = "";
  }
};

// ---------- 详情 ----------
const detailVisible = ref(false);
const detailForm = reactive({
  CompID: "",
  CompName: "",
  InitialDate: "",
  Uses: 0,
  TotalUses: 0,
  MaintDate: null,
  CleanStatus: 0,
});

// ---------- API 交互 ----------
// 获取工治具类型列表（用于下拉选择）
const getTypeList = async () => {
  try {
    const res: any = await queryToolsMold({});
    if (res.Success) {
      typeList.value = res.Data || [];
    }
  } catch (error) {
    console.error("获取类型列表失败:", error);
  }
};

// 获取工治具台账列表
const getIDData = async () => {
  loading.value = true;
  const params = {
    PageIndex: currentPage.value,
    PageSize: pageSize.value,
    SearchText: searchName.value.trim(),
    SearchModel: {
      OperationType: "Q",
      compid: "",
      compname: "",
      remark: "",
      user: "",
      ExpirationDate: "",
      SS_Date: "",
      SS_User: "",
      SS_Content: "",
      SS_UpdateDate: "",
      SelectType: ["1", "2"],
      ExpireLong: "",
      ExpireUnit: "",
    },
    StartTime: "",
    EndTime: "",
  };
  try {
    const res: any = await queryToolsID(params);
    if (res.Success) {
      // console.log(res.Data);
      let rawData: any[] = [];
      rawData = res.Data.list;
      total.value = res.Data.Total || 0;
      tableData.value = rawData.map((item: any) => ({
        ...item,
        ExpireDate: item.ExpireDate ? dayjs(item.ExpireDate).format("YYYY-MM-DD") : "",
        Ud_dt: item.Ud_dt ? dayjs(item.Ud_dt).format("YYYY-MM-DD HH:mm:ss") : "",
      }));
      // 修复分页边界：如果当前页无数据且不是第一页，回退一页
      if (tableData.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
        getIDData();
        return;
      }
    } else {
      ElMessage.error(res.Msg || t("message.queryFailure"));
      tableData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error("请求数据失败:", error);
    ElMessage.error(t("message.queryFailure"));
  } finally {
    loading.value = false;
  }
};

// 搜索
const searchData = () => {
  currentPage.value = 1;
  getIDData();
};

const clearData = () => {
  searchName.value = "";
  currentPage.value = 1;
  getIDData();
};

// 新增
const addOpen = () => {
  getTypeList(); // 刷新类型列表
  addVisible.value = true;
};

const addCancel = () => {
  addVisible.value = false;
  addFormRef.value?.resetFields();
  Object.assign(addForm, {
    operationType: "I",
    compid: "",
    compname: "",
    remark: "",
    user: userStore.getUserInfo,
    expirationDate: "",
  });
  fixtureCategory.value = "";
};

const addSubmit = async () => {
  try {
    await addFormRef.value.validate();
    submitLoading.value = true;
    const res: any = await insertToolsID(addForm);
    if (res.Success) {
      ElMessage.success(t("message.addSuccess"));
      addVisible.value = false;
      await getIDData();
    } else {
      ElMessage.error(res.Msg || t("message.addFailure"));
    }
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

// 编辑
const handleEdit = (row: any) => {
  getTypeList();
  editForm.compid = row.Tool;
  editForm.compname = row.Model;
  editForm.remark = row.Dsc || "";
  editForm.expirationDate = row.ExpireDate || "";
  // 根据当前选中的类型预填类别和描述
  const selected = typeList.value.find(item => item.ToolsMold === row.Model);
  if (selected) {
    fixtureCategoryEdit.value = getCategoryText(selected.Category);
    if (!editForm.remark) editForm.remark = selected.MaterialName || "";
  } else {
    fixtureCategoryEdit.value = "";
  }
  editVisible.value = true;
};

const editCancel = () => {
  editVisible.value = false;
  editFormRef.value?.resetFields();
  fixtureCategoryEdit.value = "";
};

const editSubmit = async () => {
  try {
    await editFormRef.value.validate();
    submitLoading.value = true;
    if (!editForm.expirationDate) editForm.expirationDate = "";
    const res: any = await updateToolsID(editForm);
    if (res.Success) {
      ElMessage.success(t("message.editSuccess"));
      editVisible.value = false;
      await getIDData();
    } else {
      ElMessage.error(res.Msg || t("message.editFailure"));
    }
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

// 详情
const handleDetail = async (row: any) => {

  try {
    const res: any = await queryAssetToolsID({ operationType: "QD", compid: row.Tool });

    if (res.Success) {
      const data = res.Data[0] || {};
      Object.assign(detailForm, {
        CompID: data.CompID || "",
        CompName: data.CompName || "",
        InitialDate: data.InitialDate ? dayjs(data.InitialDate).format("YYYY-MM-DD HH:mm:ss") : "",
        Uses: data.Uses || 0,
        TotalUses: data.TotalUses || 0,
        MaintDate: data.InitialDate ? dayjs(data.InitialDate).format("YYYY-MM-DD HH:mm:ss") : "",
        CleanStatus: data.CleanStatus ?? 0,
      });
      detailVisible.value = true;
    } else {
      ElMessage.error(res.Msg || t("message.queryFailure"));
    }
  } catch (error) {

    ElMessage.error(t("message.queryFailure"));
  }
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    t("message.confirmDelete", { code: row.Tool, name: row.Model }),
    t("publicText.tip"),
    { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
  )
    .then(async () => {
      loading.value = true;
      try {
        const data = {
          operationType: "D",
          compid: row.Tool,
          compname: row.Model,
          remark: "",
          user: userStore.getUserInfo,
          expirationDate: row.ExpireDate || "",
        };
        const res: any = await deleteToolsID(data);
        if (res.Success) {
          ElMessage.success(t("message.deleteSuccess"));
          if (tableData.value.length === 1 && currentPage.value > 1) currentPage.value--;
          await getIDData();
        } else {
          ElMessage.error(res.Msg || t("message.deleteFailure"));
        }
      } catch (error) {
        ElMessage.error(t("message.deleteFailure"));
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info(t("publicText.cancel"));
    });
};

// 报废
const handleScrap = (row: any) => {
  ElMessageBox.confirm(
    t("deviceManage.fixtureEntry.confirmScrap", { code: row.Tool }),
    t("publicText.tip"),
    { confirmButtonText: t("publicText.confirm"), cancelButtonText: t("publicText.cancel"), type: "warning" }
  )
    .then(async () => {
      loading.value = true;
      try {
        const data = {
          operationType: "S",
          compid: row.Tool,
          compname: row.Model,
          remark: "",
          user: userStore.getUserInfo,
          expirationDate: row.ExpireDate || "",
        };
        const res: any = await scrapToolsID(data);
        if (res.Success) {
          ElMessage.success(t("deviceManage.fixtureEntry.scrapSuccess"));
          if (tableData.value.length === 1 && currentPage.value > 1) currentPage.value--;
          await getIDData();
        } else {
          ElMessage.error(res.Msg || t("deviceManage.fixtureEntry.scrapFailure"));
        }
      } catch (error) {
        ElMessage.error(t("deviceManage.fixtureEntry.scrapFailure"));
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info(t("publicText.cancel"));
    });
};

// 储位清除（批量）
const handleClearCell = () => {
  const totalRows = selectedRows.value || [];
  const validRows = totalRows.filter((r: any) => r && r.Cell);
  if (validRows.length === 0) return;
  const skipCount = totalRows.length - validRows.length;

  // 储位列表：超过 8 条截断
  const MAX_SHOW = 8;
  const cellArr = validRows.map((r: any) => String(r.Cell));
  const shownCells = cellArr.slice(0, MAX_SHOW).join("、");
  let cellText = shownCells;
  if (cellArr.length > MAX_SHOW) {
    cellText += t("deviceManage.fixtureEntry.clearCellSkipHint", {
      count: cellArr.length,
      n: cellArr.length - MAX_SHOW,
    });
  }

  const message =
    totalRows.length === validRows.length
      ? t("deviceManage.fixtureEntry.confirmClearCell", { cell: cellText })
      : t("deviceManage.fixtureEntry.confirmClearCellBatch", {
          total: totalRows.length,
          skip: skipCount,
          count: validRows.length,
          cell: cellText,
        });

  ElMessageBox.confirm(message, t("publicText.tip"), {
    confirmButtonText: t("publicText.confirm"),
    cancelButtonText: t("publicText.cancel"),
    type: "warning",
    dangerouslyUseHTMLString: false,
  })
    .then(async () => {
      loading.value = true;
      try {
        const data = {
          items: validRows.map((r: any) => ({ rid: r.Tool, Cell: r.Cell })),
          UserNo: userStore.getUserInfo || "",
        };
        const res: any = await CancelRackTask(data);
        if (res.Success) {
          ElMessage.success(t("deviceManage.fixtureEntry.clearCellSuccess"));
          // 清除成功后清空选择
          tableRef.value?.clearSelection?.();
          await getIDData();
        } else {
          ElMessage.error(res.Msg || t("deviceManage.fixtureEntry.clearCellFailure"));
        }
      } catch (error) {
        ElMessage.error(t("deviceManage.fixtureEntry.clearCellFailure"));
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info(t("publicText.cancel"));
    });
};

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

// 辅助函数：状态标签样式
const tagType = (status: number) => {
  switch (status) {
    case -1: return "danger";
    case 0: return "info";
    case 1: return "success";
    case 2: return "";
    case 3: return "info";
    case 4: return "warning";
    default: return "";
  }
};

const tagText = (status: number) => {
  switch (status) {
    case -1: return t("deviceManage.fixtureEntry.statusScrapped");
    case 0: return t("deviceManage.fixtureEntry.statusEntered");
    case 1: return "";
    case 2: return t("deviceManage.fixtureEntry.statusOnShelf");
    case 3: return t("deviceManage.fixtureEntry.statusBound");
    case 4: return t("deviceManage.fixtureEntry.statusIssued");
    default: return "";
  }
};

const getCleanStatusText = (status: number) => {
  switch (status) {
    case 0: return t("deviceManage.fixtureEntry.cleanStatusClean");
    case 1: return t("deviceManage.fixtureEntry.cleanStatusInUse");
    case 2: return t("deviceManage.fixtureEntry.cleanStatusDirty");
    default: return "";
  }
};

// 判断是否过期（当前日期 >= 到期日期）
const isExpired = (dateStr: string) => {
  if (!dateStr) return false;
  const now = new Date();
  const target = new Date(dateStr + "T00:00:00");
  return now >= target;
};

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
  getIDData();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getIDData();
};

// 表格高度自适应
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

// 生命周期
onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getTypeList();
  getIDData();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.el-pagination {
  justify-content: center;
}
</style>