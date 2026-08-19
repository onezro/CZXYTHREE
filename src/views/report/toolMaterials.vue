<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="formRef" :model="getForm" :inline="true" size="small" @submit.prevent>
          <el-form-item :label="t('report.toolMaterials.issueNo')" class="mb-2">
            <el-input v-model="getForm.OrderNo" clearable :placeholder="t('report.toolMaterials.inputIssueNo')"
              style="width: 300px" @clear="clearInput" @keyup.enter="getData" />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()" icon="Search">{{ t('publicText.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table ref="tableRef" :data="pagedTableData" border :height="tableHeight" style="width: 100%" size="small">
        <el-table-column :label="t('publicText.index')" width="60" align="center">
          <template #default="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="WO" :label="t('report.toolMaterials.wo')"
          :min-width="getColumnWidth('WO')" />
        <el-table-column prop="Tool" :label="t('report.toolMaterials.boundId')"
          :min-width="getColumnWidth('Tool')" />
        <el-table-column prop="Model" :label="t('report.toolMaterials.pn')"
          :min-width="getColumnWidth('Model')" />
        <el-table-column prop="Cell" :label="t('report.toolMaterials.cell')"
          :min-width="getColumnWidth('Cell')" />
        <el-table-column prop="Qty" :label="t('report.toolMaterials.qty')"
          :min-width="getColumnWidth('Qty')" />
      </el-table>
      <div class="block" style="margin-top: 8px">
        <el-pagination align="center" background size="small" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { GetToolChkOutList } from "@/api/report/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElNotification } from "element-plus";
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

const { t } = useI18n();

const tableRef = ref();
const formRef = ref();
const tableHeight = ref(0);
const tableData = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);

const getForm = reactive({
  OrderNo: "",
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
  if (getForm.OrderNo == "") {
    ElNotification({
      type: "error",
      title: t("publicText.tipTitle"),
      message: t("report.toolMaterials.inputIssueNo"),
    });
    return;
  }
  GetToolChkOutList(getForm).then((res: any) => {
    if (res.Success) {
      tableData.value = res.Data;
    } else {
      tableData.value = [];
      ElNotification({
        type: "error",
        title: t("publicText.tipTitle"),
        message: res.Message,
      });
    }
  });
};

const clearInput = () => {
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
