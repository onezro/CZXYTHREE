<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
  
                <el-form class="form" :inline="true" size="small" @submit.prevent>
                    <div class="flex-container">
                        <div>
                            <el-form-item :label="t('finishProduct.productTraceability.finishCode')" class="mb-2">
                                <el-input :placeholder="t('finishProduct.productTraceability.finishCodePlaceholder')"
                                    clearable style="width: 400px" v-model="productNumber" class="input-with-select"
                                    @keyup.enter="getPcbId">
                                </el-input>
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="getPcbId">{{ t('publicText.query') }}</el-button>
                            </el-form-item>
                        </div>
                        <el-form-item class="mb-2">
                            <el-button type="success" @click="handleExport">{{
                                t('finishProduct.productTraceability.downloadTable') }}</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            
            <el-table ref="tableRef" :data="tableData" :height="tableHeight" size="small"
                 border stripe style="width: 100%">
                <el-table-column :label="t('publicText.index')" type="index" align="center"
                    width="55"></el-table-column>
                <el-table-column prop="OrderName" :label="t('finishProduct.productTraceability.workOrder')"
                    :min-width="getColumnWidth('OrderName')"></el-table-column>
                <el-table-column prop="AssemblyName" :label="t('finishProduct.productTraceability.productPartNo')"
                    :min-width="getColumnWidth('AssemblyName')">
                </el-table-column>
                <el-table-column prop="finishedProduct" :label="t('finishProduct.productTraceability.finishCode')"
                    :min-width="getColumnWidth('finishedProduct')">
                </el-table-column>
                <el-table-column prop="SerialNumber" :label="t('finishProduct.productTraceability.pcbId')"
                    :min-width="getColumnWidth('SerialNumber')"> </el-table-column>
                <el-table-column prop="OperationID" :label="t('finishProduct.productTraceability.processId')" width="80"
                    align="center"> </el-table-column>
                <el-table-column prop="OperationName" :label="t('finishProduct.productTraceability.processName')"
                    :min-width="getColumnWidth('OperationName')">
                </el-table-column>
                <el-table-column prop="EquipmentName" :label="t('finishProduct.productTraceability.equipmentName')"
                    :min-width="getColumnWidth('EquipmentName')">
                </el-table-column>
                <el-table-column prop="DateTime" :label="t('finishProduct.productTraceability.passTime')" width="150">
                </el-table-column>
                <el-table-column prop="StatusCODE" :label="t('finishProduct.productTraceability.result')" width="100"
                    align="center"> </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    XY_PCBAHisControl,
    getContainerMoves,
    GetCodeBYPcbSN,
} from "@/api/finishProduct/productTraceability";
import { exportTableByRef } from "@/utils/exportExcel/generalExportExcel";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessage, ElLoading } from "element-plus";
import { ref, reactive, onMounted, onBeforeMount, onUnmounted, nextTick } from "vue";
import dayjs from "dayjs";

const { t } = useI18n();

const tableRef = ref();

const heardStyle = {
    background: "rgb(102, 146, 217)",
    color: "#ffffff",
};

const tableData = ref<any[]>([]);
const productNumber = ref("");
const oldProduct = ref("");
const tableHeight = ref(0);

const getDataText = reactive({
    seiralNumber: "",
    workOrder: "",
    operationType: "S",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t("publicText.index")],
});

const startLoading = () => {
    return ElLoading.service({
        lock: true,
        text: "Loading...",
        background: "rgba(0, 0, 0, 0.2)",
    });
};

const getData = () => {
    return new Promise<void>((resolve) => {
        XY_PCBAHisControl(getDataText).then(({ data }: any) => {
            if (data.Status !== "NG") {
                const dataList = data.DataList.map((item: any) => {
                    return {
                        ...item,
                        finishedProduct: oldProduct.value,
                    };
                });
                tableData.value.push(...dataList);
            } else {
                tableData.value = [];
            }
            resolve();
        });
    });
};

const getDpiData = () => {
    return new Promise<void>((resolve) => {
        getContainerMoves(getDataText.seiralNumber).then((res: any) => {
            const arr = res.Data.map((item: any) => {
                return {
                    ...item,
                    finishedProduct: oldProduct.value,
                };
            }).sort((a: any, b: any) => a.OperationID - b.OperationID);
            tableData.value.push(...arr);
            resolve();
        });
    });
};

const getAllData = async () => {
    const loading = startLoading();
    tableData.value = [];
    await getData();
    await getDpiData();
    loading.close();
};

const getPcbId = () => {
    GetCodeBYPcbSN(productNumber.value)
        .then(({ data }: any) => {
            if (data.Code === 200 && data.Data != null) {
                oldProduct.value = productNumber.value;
                getDataText.seiralNumber = data.Data;
                getAllData();
            } else {
                ElMessage.error(data.Msg);
            }
        })
        .catch((err: any) => {
            ElMessage.error(err);
        });
};

const handleExport = async () => {
    if (tableData.value.length === 0) {
        ElMessage.warning(t("finishProduct.productTraceability.emptyList"));
        return;
    }
    try {
        await exportTableByRef(tableRef.value, tableData.value, {
            fileName: `${t('finishProduct.productTraceability.productTraceability')}${dayjs().format("YYYYMMDD-HHmmss")}`,
            i18nT: t,
        });
    } catch (error: any) {
        ElMessage.error(error.message || t("publicText.failure"));
    }
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 150;
    });
};

onBeforeMount(() => {
    getScreenHeight();
});

onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
});

onUnmounted(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.table_header {
    padding-bottom: 8px;
}

.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
</style>
