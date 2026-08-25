<template>
  <div class="p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center pb-2">
        <div class="flex">
          <el-button type="primary" size="small" @click="addOpen">
            {{ $t("publicText.add") }}
          </el-button>
          <el-button type="success" size="small" @click="downloadFile">
            {{ $t("deviceManage.fixtureProduct.downloadTemplate") }}
          </el-button>
          <el-upload class="ml-2" :before-upload="handleFileChange" action="#" :show-file-list="false" accept=".xlsx">
            <el-button type="warning" size="small">
              {{ $t("publicText.import") }}
            </el-button>
          </el-upload>
        </div>
        <div>
          <el-input v-model="searchName" clearable :placeholder="$t('deviceManage.fixtureProduct.searchPlaceholder')"
            @keyup.enter.native="searchData" @clear="clearData" style="width: 350px" size="small">
            <template #append>
              <el-button type="primary" :icon="Search" @click="searchData" />
            </template>
          </el-input>
        </div>
      </div>

      <el-table ref="tableRef" :data="paginatedData" border :height="tableHeight" style="width: 100%" size="small"
        stripe highlight-current-row :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
        <el-table-column type="index" :label="$t('publicText.index')" width="55" align="center" fixed="left">
          <template #default="{ $index }">
            {{ $index + 1 + (currentPage - 1) * pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="PN" :label="$t('deviceManage.fixtureProduct.productName')"
          :min-width="getColumnWidth('PN')" show-overflow-tooltip />
        <el-table-column prop="PD_dsc" :label="$t('deviceManage.fixtureProduct.productDesc')"
          :min-width="getColumnWidth('PD_dsc')" show-overflow-tooltip />
        <el-table-column prop="Version" :label="$t('deviceManage.fixtureProduct.version')"
          :min-width="getColumnWidth('Version')" show-overflow-tooltip />
        <el-table-column prop="Side" :label="$t('deviceManage.fixtureProduct.side')" :min-width="getColumnWidth('Side')"
          show-overflow-tooltip />
        <el-table-column prop="PN_Model" :label="$t('deviceManage.fixtureProduct.type')"
          :min-width="getColumnWidth('PN_Model')" show-overflow-tooltip />
        <el-table-column prop="MaterialName" :label="$t('deviceManage.fixtureProduct.typeDesc')"
          :min-width="getColumnWidth('MaterialName')" show-overflow-tooltip />
        <el-table-column prop="Category" :label="$t('deviceManage.fixtureProduct.category')"
          :min-width="getColumnWidth('Category')" align="center">
          <template #default="{ row }">
            {{ getCategoryText(row.Category) }}
          </template>
        </el-table-column>
        <el-table-column prop="Qty" :label="$t('deviceManage.fixtureProduct.consumption')"
          :min-width="getColumnWidth('Qty')" align="right" />
        <el-table-column prop="Dsc" :label="$t('deviceManage.fixtureProduct.description')"
          :min-width="getColumnWidth('Dsc')" show-overflow-tooltip />
        <el-table-column prop="Stts" :label="$t('deviceManage.fixtureProduct.status')"
          :min-width="getColumnWidth('Stts')" align="center">
          <template #default="{ row }">
            <el-tag :type="row.Stts === 0 || row.Stts === '0' ? 'success' : 'danger'" size="small">
              {{ row.Stts === 0 || row.Stts === '0' ? $t('deviceManage.fixtureProduct.statusUsable') :
                $t('deviceManage.fixtureProduct.statusUnusable') }}
            </el-tag>
          </template>
        </el-table-column>
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
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total" />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="60%" :close-on-click-modal="false"
      @close="handleDialogClose">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" size="small">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('deviceManage.fixtureProduct.productName')" prop="ProductName">
              <el-input v-model="form.ProductName" :disabled="isEdit"
                :placeholder="$t('deviceManage.fixtureProduct.productNamePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('deviceManage.fixtureProduct.version')" prop="Version">
              <el-input v-model="form.Version" :placeholder="$t('deviceManage.fixtureProduct.versionPlaceholder')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('deviceManage.fixtureProduct.side')" prop="Side">
              <el-select v-model="form.Side" clearable :placeholder="$t('deviceManage.fixtureProduct.sidePlaceholder')"
                style="width: 100%">
                <el-option label="TOP" value="TOP" />
                <el-option label="BOT" value="BOT" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('deviceManage.fixtureProduct.type')" prop="ToolsMold">
              <el-select v-model="form.ToolsMold" filterable
                :placeholder="$t('deviceManage.fixtureProduct.typePlaceholder')" style="width: 100%"
                @change="handleTypeChange">
                <el-option v-for="item in typeList" :key="item.ToolsMold" :label="item.ToolsMold"
                  :value="item.ToolsMold" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('deviceManage.fixtureProduct.category')" prop="Category">
              <el-input v-model="form.CategoryText" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('deviceManage.fixtureProduct.typeDesc')" prop="PD_dsc">
              <el-input v-model="form.PD_dsc" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('deviceManage.fixtureProduct.consumption')" prop="Useage">
              <el-input v-model.number="form.Useage" type="number"
                :placeholder="$t('deviceManage.fixtureProduct.useagePlaceholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('deviceManage.fixtureProduct.status')" prop="Stts">
              <el-select v-model="form.Stts" style="width: 100%">
                <el-option :label="$t('deviceManage.fixtureProduct.statusUsable')" :value="0" />
                <el-option :label="$t('deviceManage.fixtureProduct.statusUnusable')" :value="9" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t("publicText.cancel") }}</el-button>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">
          {{ $t("publicText.confirm") }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Edit, Delete } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import {
  queryToolsMold,
  insertToolsSpec,
  queryToolsSpec,
  updateToolsSpec,
  deleteToolsSpec,
  importToolsSpec,
} from "@/api/deviceManage/fixture";
import { importExcelToJSON } from "@/utils/exportExcel/fixture";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";

const { t } = useI18n();

// ---------- 表格数据 ----------
const tableRef = ref();
const tableData = ref<any[]>([]);
const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const currentPage = ref(1);
const pageSize = ref(50);
const searchName = ref("");
const total = ref(0);

// 前端分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

// 治具类型列表（下拉）
const typeList = ref<any[]>([]);

// ---------- 动态列宽 ----------
const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

// ---------- 对话框 ----------
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const form = reactive({
  ProductName: "",
  Version: "",
  Side: "",
  ToolsMold: "",
  Useage: 0,
  Remark: "",
  Stts: 0 as number,
  PD_model: "",
  PD_dsc: "",
  Category: 0 as number,
  CategoryText: "",
});

const dialogTitle = computed(() =>
  isEdit.value ? t("publicText.edit") : t("publicText.add")
);

const formRules = {
  ProductName: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.fixtureProduct.productName"), trigger: "blur" }],
  ToolsMold: [{ required: true, message: t("message.pleaseSelect") + t("deviceManage.fixtureProduct.type"), trigger: "change" }],
  Useage: [{ required: true, message: t("message.pleaseInput") + t("deviceManage.fixtureProduct.consumption"), trigger: "blur" }],
};

// ---------- 辅助函数 ----------
const categoryMap = [
  { Value: 1, Text: t("deviceManage.fixtureType.printFixture") },
  { Value: 2, Text: t("deviceManage.fixtureType.ictFixture") },
];

const getCategoryText = (value: any) => {
  const found = categoryMap.find((item) => item.Value === Number(value));
  return found ? found.Text : "";
};

// 选择治具类型时自动填充类别和类型说明
const handleTypeChange = (value: string) => {
  const selected = typeList.value.find((item: any) => item.ToolsMold === value);
  if (selected) {
    form.Category = Number(selected.Category) || 0;
    form.CategoryText = getCategoryText(selected.Category);
    form.PD_dsc = selected.MaterialName || "";
  } else {
    form.Category = 0;
    form.CategoryText = "";
    form.PD_dsc = "";
  }
};

// ---------- API 交互 ----------
// 获取治具类型列表
const getTypeList = async () => {
  try {
    const res: any = await queryToolsMold({ toolsMold: "*", remark: "", operationType: "Q" });
    if (res.Success) {
      typeList.value = res.Data || [];
    }
  } catch (error) {
    console.error("获取类型列表失败:", error);
  }
};

// 全量数据（搜索前缓存）
const allData = ref<any[]>([]);

// 获取产品消耗列表
const getProductList = async () => {
  loading.value = true;
  const params = {
    ProductName: "",
    Version: "",
    Side: "",
    ToolsMold: "",
    Useage: 0,
    Remark: "",
    Stts: "",
    PD_model: "",
    PD_dsc: "",
    OperationType: "Q",
    Category: 0,
  };
  try {
    const res: any = await queryToolsSpec(params);
    if (res.Success) {
      allData.value = res.Data || [];
      tableData.value = [...allData.value];
      total.value = tableData.value.length;
      if (paginatedData.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    } else {
      ElMessage.error(res.Msg || t("message.queryFailure"));
      allData.value = [];
      tableData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error(t("message.queryFailure"));
  } finally {
    loading.value = false;
  }
};

// 搜索（客户端过滤）
const searchData = () => {
  if (!searchName.value.trim()) {
    tableData.value = [...allData.value];
  } else {
    const keyword = searchName.value.toLowerCase();
    tableData.value = allData.value.filter(
      (item: any) =>
        (item.ProductName && item.ProductName.toLowerCase().includes(keyword)) ||
        (item.Version && item.Version.toLowerCase().includes(keyword)) ||
        (item.Side && item.Side.toLowerCase().includes(keyword)) ||
        (item.PD_model && item.PD_model.toLowerCase().includes(keyword))
    );
  }
  total.value = tableData.value.length;
  currentPage.value = 1;
};

const clearData = () => {
  searchName.value = "";
  tableData.value = [...allData.value];
  total.value = tableData.value.length;
  currentPage.value = 1;
};

// 新增
const addOpen = () => {
  getTypeList();
  isEdit.value = false;
  Object.assign(form, {
    ProductName: "", Version: "", Side: "", ToolsMold: "",
    Useage: 0, Remark: "", Stts: 0, PD_model: "",
    PD_dsc: "", Category: 0, CategoryText: "",
  });
  dialogVisible.value = true;
};

// 编辑
const handleEdit = (row: any) => {
  getTypeList();
  isEdit.value = true;
  Object.assign(form, {
    ProductName: row.PN || "",
    Version: row.Version || "",
    Side: row.Side || "",
    ToolsMold: row.PN_Model || "",
    Useage: row.Qty || 0,
    Remark: row.Dsc || "",
    Stts: row.Stts !== undefined ? Number(row.Stts) : 0,
    PD_model: row.PD_model || "",
    PD_dsc: row.MaterialName || "",
    Category: Number(row.Category) || 0,
    CategoryText: getCategoryText(row.Category),
  });
  dialogVisible.value = true;
};

// 提交表单（新增/修改）
const onSubmit = async () => {
  try {
    await formRef.value.validate();
    submitLoading.value = true;

    // PD_model = 产品-版本-面别
    const pdModel = `${form.ProductName}-${form.Version}-${form.Side}`;

    const params = {
      ProductName: form.ProductName,
      Version: form.Version,
      Side: form.Side,
      ToolsMold: form.ToolsMold,
      Useage: form.Useage,
      Remark: form.Remark,
      Stts: String(form.Stts),
      PD_model: pdModel,
      PD_dsc: form.PD_dsc,
      OperationType: isEdit.value ? "U" : "I",
      Category: form.Category,
    };

    let res: any;
    if (isEdit.value) {
      res = await updateToolsSpec(params);
    } else {
      res = await insertToolsSpec(params);
    }

    if (res.Success) {
      ElMessage.success(isEdit.value ? t("message.editSuccess") : t("message.addSuccess"));
      dialogVisible.value = false;
      await getProductList();
    } else {
      ElMessage.error(res.Msg || (isEdit.value ? t("message.editFailure") : t("message.addFailure")));
    }
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

// 删除（传 ToolsMold + PD_model）
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    t("message.confirmDelete", { code: row.ProductName, name: row.PN_Model }),
    t("publicText.tip"),
    {
      confirmButtonText: t("publicText.confirm"),
      cancelButtonText: t("publicText.cancel"),
      type: "warning",
    }
  )
    .then(async () => {
      loading.value = true;
      try {
        const res: any = await deleteToolsSpec({
          ProductName: row.PN || "",
          Version: row.Version || "",
          Side: row.Side || "",
          ToolsMold: row.PN_Model || "",
          Useage: row.Qty || 0,
          Remark: row.Dsc || "",
          Stts: String(row.Stts ?? ""),
          PD_model: row.PD_model || "",
          PD_dsc: row.MaterialName || "",
          OperationType: "D",
          Category: Number(row.Category) || 0,
        });
        if (res.Success) {
          ElMessage.success(t("message.deleteSuccess"));
          if (paginatedData.value.length === 1 && currentPage.value > 1) currentPage.value--;
          await getProductList();
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

// 对话框关闭回调
const handleDialogClose = () => {
  formRef.value?.resetFields();
};

// ---------- 导入/导出 ----------
const handleFileChange = async (file: File) => {
  try {
    const data = await importExcelToJSON(file, {
      hasHeader: true,
      headerMapping: {
        产品编码: "productName",
        类型: "toolsMold",
        消耗量: "useage",
        描述: "remark",
      },
      typeMapping: {
        useage: "int",
        productName: "string",
        toolsMold: "string",
        remark: "string",
      },
    });
    const res: any = await importToolsSpec(data);
    if (res.Success) {
      ElMessage.success(t("deviceManage.fixtureProduct.importSuccess"));
      await getProductList();
    } else {
      ElMessage.error(res.Msg || t("deviceManage.fixtureProduct.importFailure"));
    }
  } catch (error) {
    console.error("导入失败:", error);
    ElMessage.error(t("deviceManage.fixtureProduct.importFailure"));
  }
  return false;
};

const downloadFile = () => {
  window.open("http://172.20.99.21:5998/temp/产品消耗-导入模板.xlsx", "_blank");
};

// ---------- 分页 ----------
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

// ---------- 表格高度自适应 ----------
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

// ---------- 生命周期 ----------
onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getTypeList();
  getProductList();
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
