<template>
    <div class="p-2 ite">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'">
                <el-form-item :label="t('incomingManage.inventoryCheck.reelId')" prop="reel_id" class="mb-2">
                    <el-input v-model="getForm.reel_id"
                        :placeholder="t('incomingManage.inventoryCheck.reelIdPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.materialPn')" prop="material_pn" class="mb-2">
                    <el-input v-model="getForm.material_pn"
                        :placeholder="t('incomingManage.inventoryCheck.materialPnPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.workOrder')" prop="work_order" class="mb-2">
                    <el-input v-model="getForm.work_order"
                        :placeholder="t('incomingManage.inventoryCheck.workOrderPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.boxSn')" prop="box_sn" class="mb-2">
                    <el-input v-model="getForm.box_sn"
                        :placeholder="t('incomingManage.inventoryCheck.boxSnPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.preparationNo')" prop="preparation_no" class="mb-2">
                    <el-input v-model="getForm.preparation_no"
                        :placeholder="t('incomingManage.inventoryCheck.preparationNoPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.bidNo')" prop="bid_no" class="mb-2">
                    <el-input v-model="getForm.bid_no"
                        :placeholder="t('incomingManage.inventoryCheck.bidNoPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.supplier')" prop="supplier" class="mb-2">
                    <el-input v-model="getForm.supperlier"
                        :placeholder="t('incomingManage.inventoryCheck.supplierPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.productionDate')" prop="production_date" class="mb-2">
                    <el-date-picker v-model="getForm.production_date" type="date" value-format="YYYY-MM-DD"
                        placeholder="请选择日期" style="width: 160px" @change="searchData" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.inOri')" prop="in_ori" class="mb-2">
                    <el-input v-model="getForm.in_ori"
                        :placeholder="t('incomingManage.inventoryCheck.inOriPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.outOri')" prop="out_ori" class="mb-2">
                    <el-input v-model="getForm.out_ori"
                        :placeholder="t('incomingManage.inventoryCheck.outOriPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.isFirst')" prop="is_first" class="mb-2">
                    <el-select v-model="getForm.is_first" clearable
                        :placeholder="t('publicText.pleaseSelect')" style="width: 160px" @change="searchData">
                        <el-option :label="t('incomingManage.inventoryCheck.isFirstAll')" value="" />
                        <el-option :label="t('incomingManage.inventoryCheck.isFirstYes')" :value="0" />
                        <el-option :label="t('incomingManage.inventoryCheck.isFirstNo')" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('incomingManage.inventoryCheck.groupOrder')" prop="group_order" class="mb-2">
                    <el-input v-model="getForm.group_order"
                        :placeholder="t('incomingManage.inventoryCheck.groupOrderPlaceholder')" clearable
                        @clear="searchData" @keyup.enter="searchData" style="width: 160px" />
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button type="primary" @click="searchData">{{ t('publicText.query') }}</el-button>
                    <el-button @click="handleReset">{{ t('publicText.reset') }}</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pagedData" ref="eltableRef" size="small" :style="{ width: '100%' }" :height="tableHeight"
                :tooltip-effect="'dark'" border fit highlight-current-row  :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.inventoryCheck.reelId')" prop="reel_id"
                    :min-width="getColumnWidth('reel_id')" fixed show-overflow-tooltip />
                <el-table-column :label="t('incomingManage.inventoryCheck.materialPn')" prop="material_pn"
                    :min-width="getColumnWidth('material_pn')" fixed show-overflow-tooltip />
                    <el-table-column prop="name" :label="t('Scheduling.CallMaterials.PNName')"
                    :min-width="getColumnWidth('name')" show-overflow-tooltip />
                <el-table-column prop="pn_spec" :label="t('Scheduling.CallMaterials.PNDesc')"
                    :min-width="getColumnWidth('pn_spec')" show-overflow-tooltip />
                <el-table-column :label="t('incomingManage.inventoryCheck.workOrder')" prop="work_order"
                    :min-width="getColumnWidth('work_order')" show-overflow-tooltip />
                <!-- <el-table-column :label="t('incomingManage.inventoryCheck.preparationNo')" prop="preparation_no"
                    :min-width="getColumnWidth('preparation_no')" show-overflow-tooltip /> -->
                <!-- <el-table-column :label="t('incomingManage.inventoryCheck.bidNo')" prop="bid_no"
                    :min-width="getColumnWidth('bid_no')" show-overflow-tooltip /> -->
                <el-table-column :label="t('incomingManage.inventoryCheck.qty')" prop="qty" width="100"
                    align="right" />
                <el-table-column :label="t('incomingManage.inventoryCheck.cellId')" prop="cell_id"
                    :min-width="getColumnWidth('cell_id')" show-overflow-tooltip />
                <el-table-column :label="t('incomingManage.inventoryCheck.isFirst')" prop="is_first" width="100"
                    align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.is_first ? 'success' : 'info'" size="small">
                            {{ row.is_first ? t('publicText.yes') : t('publicText.no') }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.inventoryCheck.sourceUser')" prop="source_user" width="100"
                    align="center" />
                <el-table-column :label="t('incomingManage.inventoryCheck.createrTime')" prop="creater_time"
                    :min-width="getColumnWidth('creater_time')" show-overflow-tooltip />
                <!-- <el-table-column :label="t('incomingManage.inventoryCheck.groupOrder')" prop="group_order"
                    :min-width="getColumnWidth('group_order')" show-overflow-tooltip />
                <el-table-column :label="t('incomingManage.inventoryCheck.inOri')" prop="in_ware_house"
                    :min-width="getColumnWidth('in_ware_house')" show-overflow-tooltip />
                <el-table-column :label="t('incomingManage.inventoryCheck.outOri')" prop="out_ware_house"
                    :min-width="getColumnWidth('out_ware_house')" show-overflow-tooltip /> -->
                <el-table-column :label="t('incomingManage.inventoryCheck.remark')" prop="Remark"
                    :min-width="getColumnWidth('Remark')" show-overflow-tooltip />
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
                    layout="total,sizes, prev, pager, next" :total="total" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { QueryMaterialReceiveList } from "@/api/incomingManage/inventoryCheck";
import { ref, reactive, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const eltableRef = ref();
const tableHeight = ref(0);
const loading = ref(false);
const tableData = ref<any[]>([]);
const getForm = reactive({
    PageIndex: 1,
    PageSize: 50,
    reel_id: "",
    material_pn: "",
    work_order: "",
    box_sn: "",
    preparation_no: "",
    bid_no: "",
    supperlier: "",
    production_date: "",
    in_ori: "",
    out_ori: "",
    is_first: "" as string | number,
    group_order: "",
});

const total = computed(() => tableData.value.length);

const pagedData = computed(() => {
    const start = (getForm.PageIndex - 1) * getForm.PageSize;
    return tableData.value.slice(start, start + getForm.PageSize);
});

const getData = () => {
    loading.value = true;
    const params: any = {};
    if (getForm.reel_id) params.reel_id = getForm.reel_id;
    if (getForm.material_pn) params.material_pn = getForm.material_pn;
    if (getForm.work_order) params.work_order = getForm.work_order;
    if (getForm.box_sn) params.box_sn = getForm.box_sn;
    if (getForm.preparation_no) params.preparation_no = getForm.preparation_no;
    if (getForm.bid_no) params.bid_no = getForm.bid_no;
    if (getForm.supperlier) params.supperlier = getForm.supperlier;
    if (getForm.production_date) params.production_date = getForm.production_date;
    if (getForm.in_ori) params.in_ori = getForm.in_ori;
    if (getForm.out_ori) params.out_ori = getForm.out_ori;
    if (getForm.is_first !== "" && getForm.is_first !== null && getForm.is_first !== undefined) {
        params.is_first = getForm.is_first;
    }
    if (getForm.group_order) params.group_order = getForm.group_order;
    QueryMaterialReceiveList(params).then((res: any) => {
        if (res.Success) {
            if (res.Data && Array.isArray(res.Data)) {
                tableData.value = res.Data.map((item: any) => ({
                    ...item,
                    creater_time: item.creater_time ? dayjs(item.creater_time).format("YYYY-MM-DD HH:mm:ss") : "",
                }));
            } else {
                tableData.value = [];
            }
        } else {
            ElMessage.error(res.Message || "查询失败");
            tableData.value = [];
        }
    }).catch(() => {
        ElMessage.error("查询失败");
        tableData.value = [];
    }).finally(() => {
        loading.value = false;
    });
};

const searchData = () => {
    getForm.PageIndex = 1;
    getData();
};

const handleReset = () => {
    getForm.reel_id = "";
    getForm.material_pn = "";
    getForm.work_order = "";
    getForm.box_sn = "";
    getForm.preparation_no = "";
    getForm.bid_no = "";
    getForm.supperlier = "";
    getForm.production_date = "";
    getForm.in_ori = "";
    getForm.out_ori = "";
    getForm.is_first = "";
    getForm.group_order = "";
    getForm.PageIndex = 1;
    getData();
};

const handleSizeChange = (val: number) => {
    getForm.PageSize = val;
};
const handleCurrentChange = (val: number) => {
    getForm.PageIndex = val;
};

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index')]
});

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 250;
    });
};

onMounted(() => {
    getScreenHeight();
    window.addEventListener("resize", getScreenHeight);
    getData();
});
onBeforeUnmount(() => window.removeEventListener("resize", getScreenHeight));
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
