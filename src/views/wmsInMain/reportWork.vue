<template>
  <div class="p-2">
    <el-card class="box-card" :body-style="{ padding: '8px' }">
      <div class="flex justify-end mb-2">
        <div class="input_box">
          <el-input :placeholder="t('wmsInMain.reportWork.searchPlaceholder')" clearable v-model="getText.searchText"
            class="" style="width: 300px" size="small" @input="getSearchData" @change="getSearchData">
            <template #append>
              <el-button icon="Search"></el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="table_container">
        <el-table ref="tableRef" :data="tableData" :height="tableHeight" border stripe style="width: 100%" size="small">
          <el-table-column type="index" :label="t('publicText.index')" width="55" align="center">
            <template #default="scope">
              <span>{{ scope.$index + 1 + (currentPage - 1) * getText.pageSize }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Wo" :label="t('wmsInMain.reportWork.wo')" :min-width="getColumnWidth('Wo')">
          </el-table-column>
          <el-table-column prop="Containerid" :label="t('wmsInMain.reportWork.containerId')"
            :min-width="getColumnWidth('Containerid')"> </el-table-column>
          <el-table-column prop="Pn" :label="t('wmsInMain.reportWork.pn')" :min-width="getColumnWidth('Pn')" />
          <el-table-column prop="Qty" :label="t('wmsInMain.reportWork.qty')" :min-width="getColumnWidth('Qty')">
          </el-table-column>
          <el-table-column prop="CheckResult" :label="t('wmsInMain.reportWork.result')"
            :min-width="getColumnWidth('CheckResult')"> </el-table-column>
          <el-table-column prop="ReportUser" :label="t('wmsInMain.reportWork.reportUser')"
            :min-width="getColumnWidth('ReportUser')"> </el-table-column>
          <el-table-column prop="ReportTime" sortable :label="t('wmsInMain.reportWork.reportTime')"
            :min-width="getColumnWidth('ReportTime')">
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 8px">
          <el-pagination background  size="small" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :page-sizes="[5, 10, 20, 50, 100]" :current-page="currentPage"
            :page-size="getText.pageSize" layout="total,sizes, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getReportWork } from "@/api/wmsInMain/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus";
import { ref, reactive, onMounted, onBeforeMount, onUnmounted, nextTick } from "vue";

const { t } = useI18n();

const tableRef = ref();

const getText = reactive({
  pageIndex: 0,
  pageSize: 50,
  searchText: "",
});

const tableData = ref<any[]>([]);
const currentPage = ref(1);
const total = ref(0);
const tableHeight = ref(0);

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
  excludeLabels: [t("publicText.index")],
});

const getData = () => {
  getReportWork(getText).then((res: any) => {
    if (res.Success) {
      const data = JSON.parse(res.Data);
      total.value = data.Total;
      tableData.value = data.list || [];
    } else {
      ElMessageBox.alert(res.Msg, t('publicText.error'), {
        confirmButtonText: t('publicText.confirm'),
      });
    }
  });
};

const getSearchData = () => {
  getText.pageIndex = 0;
  getData();
};

const handleSizeChange = (value: number) => {
  getText.pageSize = value;
  getData();
};

const handleCurrentChange = (value: number) => {
  getText.pageIndex = value - 1;
  getData();
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 190;
  });
};

onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});

onUnmounted(() => {
  window.removeEventListener("resize", getScreenHeight);
});
</script>
<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>