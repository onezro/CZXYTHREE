<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="formRef" :model="getForm" :inline="true" @submit.prevent size="small">
          <el-form-item :label="t('report.printingRecord.productSN')" class="mb-2"><el-input
              v-model="getForm.ContainerMfg" clearable :placeholder="t('report.printingRecord.inputProductSN')"
              style="width: 300px" @clear="clearInput" @keyup.enter="getData" /></el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()" :icon="Search">{{ t('publicText.query')
              }}</el-button></el-form-item>
        </el-form>
      </div>
      <el-table ref="tableRef" :data="pagedTableData" border :height="tableHeight" style="width: 100%" size="small"
        stripe>
        <el-table-column type="index" :label="t('publicText.index')" width="60" align="center">
          <template #default="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="pcbid" :label="t('report.printingRecord.barcode')" :min-width="getColumnWidth('pcbid')">
        </el-table-column>
        <el-table-column prop="McID" :label="t('report.printingRecord.device')" :min-width="getColumnWidth('McID')">
        </el-table-column>
        <el-table-column prop="ProductName" :label="t('report.printingRecord.productCode')"
          :min-width="getColumnWidth('ProductName')"> </el-table-column>
        <el-table-column prop="OrderNo" :label="t('report.printingRecord.workOrder')"
          :min-width="getColumnWidth('OrderNo')">
        </el-table-column>
        <el-table-column prop="Label" :label="t('report.printingRecord.collectItem')"
          :min-width="getColumnWidth('Label')">
        </el-table-column>
        <el-table-column prop="Value" :label="t('report.printingRecord.collectContent')"
          :min-width="getColumnWidth('Value')">
          <template #default="{ row }">
            <span>{{ row.Value == "?" ? "" : row.Value }}</span>
          </template></el-table-column>
        <el-table-column prop="Units" :label="t('report.printingRecord.unit')" :min-width="getColumnWidth('Units')">
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination size="small" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { ElNotification } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { GetPrintingTranslator } from "@/api/report/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";

const { t } = useI18n();

const formRef = ref();
const tableRef = ref();
const tableData = ref<any[]>([]);
const tableHeight = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

const getForm = reactive({
  ContainerMfg: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.index")],
});

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

const getData = () => {
  if (getForm.ContainerMfg == "") {
    ElNotification({
      title: t("publicText.tipTitle"),
      message: t("report.printingRecord.inputProductSN"),
      type: "error",
    });
    return;
  }
  GetPrintingTranslator(getForm).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data.filter((item: any) => {
        if (item.Units) {
          return true;
        }
        return false;
      });
    } else {
      tableData.value = [];
      ElNotification({
        title: t("publicText.tipTitle"),
        message: res.Message,
        type: "error",
      });
    }
  });
};

const clearInput = () => {
  getForm.ContainerMfg = "";
  formRef.value?.resetFields();
  tableData.value = [];
};

const handleSizeChange = (value: number) => {
  pageSize.value = value;
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
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>
