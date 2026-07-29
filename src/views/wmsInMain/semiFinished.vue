<template>
  <div class="p-2">
    <el-card :body-style="{ padding: '8px' }">
      <div class="flex justify-end mb-2">
        <div class="">
          <el-input :placeholder="t('wmsInMain.semiFinished.searchPlaceholder')" clearable size="small"
            v-model="getText.searchText" style="width: 300px" @input="getSearchData" @change="getSearchData">
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
          <el-table-column prop="WO" :label="t('wmsInMain.semiFinished.wo')" :min-width="getColumnWidth('WO')">
          </el-table-column>
          <el-table-column prop="PdModel" :label="t('wmsInMain.semiFinished.pn')"
            :min-width="getColumnWidth('PdModel')">
          </el-table-column>
          <el-table-column prop="PlanQty" :label="t('wmsInMain.semiFinished.planQty')"
            :min-width="getColumnWidth('PlanQty')">
          </el-table-column>
          <el-table-column prop="ReportNumber" :label="t('wmsInMain.semiFinished.reportQty')"
            :min-width="getColumnWidth('ReportNumber')">
          </el-table-column>
          <el-table-column prop="WoStatus" :label="t('wmsInMain.semiFinished.status')"
            :min-width="getColumnWidth('WoStatus')">
            <template #default="scope">
              <span>{{ scope.row.WoStatus == 1 ? t('wmsInMain.semiFinished.closed') : t('wmsInMain.semiFinished.open')
                }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" :label="t('publicText.operation')" align="center">
            <template #default="scope">
              <el-button :type="scope.row.WoStatus == 1 ? 'primary' : 'danger'" size="small"
                @click="handleClose(scope.$index, scope.row)">{{ scope.row.WoStatus !== 1 ?
                  t('wmsInMain.semiFinished.close') : t('wmsInMain.semiFinished.open') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 8px">
          <el-pagination background align="center" size="small" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :page-sizes="[5, 10, 20, 50, 100]" :current-page="currentPage"
            :page-size="getText.pageSize" layout="total,sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { queryCloseOrder, closeOrder } from "@/api/wmsInMain/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
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
  excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const getData = () => {
  queryCloseOrder(getText)
    .then((res: any) => {
      if (res.Success) {
        const data = JSON.parse(res.Data);
        total.value = data.Total;
        tableData.value = data.list || [];
      } else {
        ElMessageBox.alert(res.Msg, t('publicText.error'), {
          confirmButtonText: t('publicText.confirm'),
        });
      }
    })
    .catch((error: any) => {
      ElMessageBox.alert(error, t('publicText.error'), {
        confirmButtonText: t('publicText.confirm'),
      });
    });
};

const handleClose = (index: number, row: any) => {
  const text = row.WoStatus == 1 ? t('wmsInMain.semiFinished.open') : t('wmsInMain.semiFinished.close');
  const stat = row.WoStatus == 1 ? 0 : 1;
  ElMessageBox.confirm(t('wmsInMain.semiFinished.confirmAction', { action: text }), t('publicText.confirmOperation'), {
    confirmButtonText: t('publicText.confirm'),
    cancelButtonText: t('publicText.cancel'),
    type: "warning",
  })
    .then(() => {
      closeOrder({
        OrderNo: row.WO,
        Stts: stat,
      })
        .then((res: any) => {
          if (res.Success) {
            if (tableData.value.length == 1 && getText.pageIndex >= 0) {
              getText.pageIndex--;
            }
            getData();
            ElMessage.success(t('wmsInMain.semiFinished.actionSuccess', { action: text }));
          } else {
            ElMessageBox.alert(res.data.Msg, t('publicText.error'), {
              confirmButtonText: t('publicText.confirm'),
            });
          }
        })
        .catch((error: any) => {
          ElMessageBox.alert(error, t('publicText.error'), {
            confirmButtonText: t('publicText.confirm'),
          });
        });
    })
    .catch(() => {
      ElMessage.info(t('wmsInMain.semiFinished.actionCancelled', { action: text }));
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

<style lang="scss" scoped></style>