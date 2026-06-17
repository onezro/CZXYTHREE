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

      <el-table ref="tableRef"  :data="paginatedData" border :height="tableHeight"
        style="width: 100%" size="small" stripe highlight-current-row>
        <el-table-column prop="PD_model" :label="$t('deviceManage.fixtureProduct.productCode')"
          :min-width="getColumnWidth('PD_model')" />
        <el-table-column prop="PN_Model" :label="$t('deviceManage.fixtureProduct.type')"
          :min-width="getColumnWidth('PN_Model')" />
        <el-table-column prop="MaterialName" :label="$t('deviceManage.fixtureProduct.typeDesc')"
          :min-width="getColumnWidth('MaterialName')" />
        <el-table-column prop="Category" :label="$t('deviceManage.fixtureProduct.category')"
          :min-width="getColumnWidth('Category')">
          <template #default="{ row }">
            {{ getCategoryText(row.Category) }}
          </template>
        </el-table-column>
        <el-table-column prop="Qty" :label="$t('deviceManage.fixtureProduct.consumption')"
          :min-width="getColumnWidth('Qty')" />
        <el-table-column prop="Dsc" :label="$t('deviceManage.fixtureProduct.description')"
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
          :page-sizes="[5, 10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
          :total="filteredData.length" />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" :close-on-click-modal="false"
      @close="handleDialogClose">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px" size="small">
        <el-form-item :label="$t('deviceManage.fixtureProduct.productCode')" prop="ProductName">
          <el-input v-model="form.ProductName" :disabled="isEdit" />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureProduct.type')" prop="ToolsMold">
          <el-select v-model="form.ToolsMold" filterable
            :placeholder="$t('deviceManage.fixtureProduct.typePlaceholder')" style="width: 100%">
            <el-option v-for="item in typeList" :key="item.ToolsMold" :label="item.ToolsMold" :value="item.ToolsMold" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureProduct.consumption')" prop="Useage">
          <el-input v-model.number="form.Useage" type="number" />
        </el-form-item>
        <el-form-item :label="$t('deviceManage.fixtureProduct.description')" prop="Remark">
          <el-input v-model="form.Remark" type="textarea" :rows="2" />
        </el-form-item>
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
  specImportControl,
} from "@/api/deviceManage/fixture";
import { importExcelToJSON } from "@/utils/exportExcel/fixture";
import { calculateColumnsWidth } from "@/utils/tableminWidth";

const { t } = useI18n();

// ---------- 表格数据 ----------
const tableRef = ref();
const tableData = ref<any[]>([]);
const filteredData = ref<any[]>([]);
const loading = ref(false);
const submitLoading = ref(false);
const tableHeight = ref(0);
const currentPage = ref(1);
const pageSize = ref(50);
const searchName = ref("");

// 分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.value.slice(start, end);
});

// 治具类型列表（下拉）
const typeList = ref<any[]>([]);

// ---------- 动态列宽 ----------
const tableColumns = computed(() => {
  if (!tableRef.value) return [];
  const columns = tableRef.value.columns
    .map((item: any) => ({ prop: item.property, label: item.label }))
    .filter((item: any) => item.label !== t("publicText.index") && item.label !== t("publicText.operation"));
  return columns;
});

const columnWidths = computed(() => {
  return calculateColumnsWidth(tableColumns.value, filteredData.value, { padding: 25, fontSize: 13 });
});

const getColumnWidth = (prop: string) => columnWidths.value[prop] || "auto";

// ---------- 对话框 ----------
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const form = reactive({
  ProductName: "",
  Useage: 0,
  ToolsMold: "",
  Remark: "",
});

const dialogTitle = computed(() =>
  isEdit.value ? t("publicText.edit") : t("publicText.add")
);

const formRules = {
  ProductName: [
    {
      required: true,
      message: t("message.pleaseInput") + t("deviceManage.fixtureProduct.productCode"),
      trigger: "blur",
    },
  ],
  ToolsMold: [
    {
      required: true,
      message: t("message.pleaseSelect") + t("deviceManage.fixtureProduct.type"),
      trigger: "change",
    },
  ],
  Useage: [
    {
      required: true,
      message: t("message.pleaseInput") + t("deviceManage.fixtureProduct.consumption"),
      trigger: "blur",
    },
  ],
};

// ---------- 辅助函数 ----------
const categoryMap = [
  { Value: "1", Text: t("deviceManage.fixtureType.printFixture") },
  { Value: "2", Text: t("deviceManage.fixtureType.ictFixture") },
  { Value: "3", Text: t("deviceManage.fixtureType.sample") },
];

const getCategoryText = (value: string) => {
  const found = categoryMap.find((item) => item.Value === value);
  return found ? found.Text : "";
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

// 获取产品消耗列表
const getProductList = async () => {
  loading.value = true;
  const params = {
    toolsMold: "",
    remark: "",
    productName: "*",
    useage: 0,
    operationType: "Q",
  };
  try {
    const res: any = await queryToolsSpec(params);
    if (res.Success) {
      const data = res.Data || [];
      tableData.value = data.sort((a: any, b: any) =>
        (a.PD_model || "").localeCompare(b.PD_model || "")
      );
      filteredData.value = [...tableData.value];
      // 修复分页边界
      if (filteredData.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    } else {
      ElMessage.error(res.Msg || t("message.queryFailure"));
      tableData.value = [];
      filteredData.value = [];
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error(t("message.queryFailure"));
  } finally {
    loading.value = false;
  }
};

// 搜索
const searchData = () => {
  if (!searchName.value.trim()) {
    filteredData.value = [...tableData.value];
  } else {
    const keyword = searchName.value.toLowerCase();
    filteredData.value = tableData.value.filter(
      (item) =>
        (item.PD_model && item.PD_model.toLowerCase().includes(keyword)) ||
        (item.PN_Model && item.PN_Model.toLowerCase().includes(keyword))
    );
  }
  currentPage.value = 1;
};

const clearData = () => {
  searchName.value = "";
  filteredData.value = [...tableData.value];
  currentPage.value = 1;
};

// 新增
const addOpen = () => {
  getTypeList();
  isEdit.value = false;
  form.ProductName = "";
  form.Useage = 0;
  form.ToolsMold = "";
  form.Remark = "";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = (row: any) => {
  getTypeList();
  isEdit.value = true;
  form.ProductName = row.PD_model;
  form.Useage = row.Qty;
  form.ToolsMold = row.PN_Model;
  form.Remark = row.Dsc || "";
  dialogVisible.value = true;
};

// ---------- 提交表单（新增/修改拆分） ----------
const onSubmit = async () => {
  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let res: any;
    if (isEdit.value) {
      // ========== 修改：调用 updateToolsSpec ==========
      res = await updateToolsSpec({
        ProductName: form.ProductName,
        ToolsMold: form.ToolsMold,
        Useage: form.Useage,
        Remark: form.Remark,
        OperationType: "U",
      });
    } else {
      // ========== 新增：调用 insertToolsSpec ==========
      res = await insertToolsSpec({
        ProductName: form.ProductName,
        ToolsMold: form.ToolsMold,
        Useage: form.Useage,
        Remark: form.Remark,
        OperationType: "I",
      });
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

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    t("message.confirmDelete", { code: row.PD_model, name: row.PN_Model }),
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
          ToolsMold: row.PN_Model,
          Remark: row.Dsc || "",
          ProductName: row.PD_model,
          Useage: row.Qty,
          OperationType: "D",
        });
        if (res.Success) {
          ElMessage.success(t("message.deleteSuccess"));
          if (filteredData.value.length === 1 && currentPage.value > 1) currentPage.value--;
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
// 导入Excel
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
    const res: any = await specImportControl(data);
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
  return false; // 阻止默认上传行为
};

// 下载模板
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