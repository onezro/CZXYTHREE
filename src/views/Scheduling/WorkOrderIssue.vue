<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.native.prevent>
        <el-form-item :label="t('Scheduling.WorkOrderIssue.groupOrder')" prop="groupOrder" class="mb-2">
          <el-input v-model="getForm.group_order" placeholder="" clearable @clear="queryReturnMaterials"
            @keyup.enter.native="queryReturnMaterials" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="t('Scheduling.WorkOrderIssue.reelId')" prop="reelId" class="mb-2">
          <el-input v-model="getForm.reel_id" placeholder="" clearable @clear="queryReturnMaterials"
            @keyup.enter.native="queryReturnMaterials" style="width: 200px" />
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="queryReturnMaterials">{{ t('publicText.query') }}</el-button>
        </el-form-item>
        <!-- <el-form-item class="mb-2">
          <el-button type="warning" @click="initRecords">{{ t('Scheduling.WorkOrderIssue.initRecords') }}</el-button>
        </el-form-item> -->
        <el-form-item class="mb-2">
          <el-button type="success" @click="handleIssue">{{ t('Scheduling.WorkOrderIssue.issueMaterials') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
        :tooltip-effect="'dark'" border fit ref="eltableRef" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
        <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
          <template #default="scope">
            <span>{{ (getForm.PageIndex - 1) * getForm.PageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.workOrder')" prop="work_order"
          :min-width="getColumnWidth('work_order')" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.groupOrder')" prop="group_order"
          :min-width="getColumnWidth('group_order')" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.materialPn')" prop="material_pn"
          :min-width="getColumnWidth('material_pn')" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.reelId')" prop="reel_id"
          :min-width="getColumnWidth('reel_id')" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.totalQty')" prop="total_qty" width="100"
          align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.remainQty')" prop="remain_qty" width="100"
          align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.actRetQty')" prop="act_ret_qty" width="100"
          align="center" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.status')" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'info'" size="small">
              {{ row.status ? t('Scheduling.WorkOrderIssue.yes') : t('Scheduling.WorkOrderIssue.no') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('Scheduling.WorkOrderIssue.batchId')" prop="batch_id"
          :min-width="getColumnWidth('batch_id')" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.outOri')" prop="out_ori"
          :min-width="getColumnWidth('out_ori')" />
        <el-table-column :label="t('Scheduling.WorkOrderIssue.outWareHouse')" prop="out_ware_house"
          :min-width="getColumnWidth('out_ware_house')" />
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
      <div class="mt-2">
        <el-pagination :size="'small'" background @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
          :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
          layout="total,sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { QueryReturnMaterials, InitRecordsFromReceive, IssueMaterials } from "@/api/Scheduling/WorkOrderIssue";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { ref, reactive, nextTick, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();
const eltableRef = ref();
const tableHeight = ref(0);
const tableData = ref<any[]>([]);
const total = ref(0);

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
  excludeLabels: [t('publicText.index')],
  excludeTypes: ['index']
});

const getForm = reactive({
  PageIndex: 1,
  PageSize: 50,
  group_order: '',
  reel_id: '',
});

onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});

const queryReturnMaterials = () => {
  if (!getForm.group_order) {
    ElMessage.warning(t("Scheduling.WorkOrderIssue.pleaseInputGroupOrder"));
    return;
  }

  QueryReturnMaterials({
    group_order: getForm.group_order,
    reel_id: getForm.reel_id,
  })
    .then((res: any) => {
      if (res.Success && res.Data) {
        tableData.value = res.Data;
        total.value = res.Data.length;
      } else {
        tableData.value = [];
        total.value = 0;
      }
      
    })
    .catch(() => {
      
    });
};

const initRecords = () => {
  if (!getForm.group_order) {
    ElMessage.warning(t("Scheduling.WorkOrderIssue.pleaseInputGroupOrder"));
    return;
  }

  InitRecordsFromReceive({
    group_order: getForm.group_order,
  })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(t("publicText.success"));
        queryReturnMaterials();
      } else {
        ElMessage.error(res.Message || t("publicText.failure"));
      }
    
    })
    .catch(() => {
     
    });
};

const handleIssue = () => {
  if (!getForm.group_order) {
    ElMessage.warning(t("Scheduling.WorkOrderIssue.pleaseInputGroupOrder"));
    return;
  }
  ElMessageBox.confirm(
    t("Scheduling.WorkOrderIssue.confirmAllPointed"),
    t("publicText.tip"),
    {
      confirmButtonText: t("publicText.confirm"),
      cancelButtonText: t("publicText.cancel"),
      type: "warning",
    }
  )
    .then(() => {
      issueMaterials();
    })
    .catch(() => {});
};

const issueMaterials = () => {

  IssueMaterials({
    group_order: getForm.group_order,
    operator_name: userStore.getUserInfo || "",
    published_bom_status: "",
    confirm_all_pointed: true,
  })
    .then((res: any) => {
      if (res.Success) {
        ElMessage.success(res.Message || t("publicText.success"));
        queryReturnMaterials();
      } else {
        ElMessage.error(res.Message || t("publicText.failure"));
      }
      
    })
    .catch(() => {
    
    });
};

const handleSizeChange = (val: number) => {
  getForm.PageSize = val;
  getForm.PageIndex = 1;
  queryReturnMaterials();
};

const handleCurrentChange = (val: number) => {
  getForm.PageIndex = val;
  queryReturnMaterials();
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 180;
  });
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>