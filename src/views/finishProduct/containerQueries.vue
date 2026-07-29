<template>
    <div class="containerQueries">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
           
                <el-form class="form" :inline="true" size="small">
                    <el-form-item class="mb-2">
                        <el-select v-model="value" style="width: 200px" :placeholder="t('publicText.pleaseSelect')" @change="change">
                            <el-option v-for="item in options" :key="item.value" :label="t(item.label)"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="value === 'rid'" class="mb-2">
                        <el-input :placeholder="t('finishProduct.containerQueries.containerIdPlaceholder')" clearable
                            style="width: 400px" v-model="form.SearchModel.rid" class="input-with-select"
                            @keyup.enter="getData">
                        </el-input>
                    </el-form-item>
                    <el-form-item v-show="value === 'pcbsn'" class="mb-2">
                        <el-input :placeholder="t('finishProduct.containerQueries.pcbCodePlaceholder')" clearable
                            style="width: 400px" v-model="form.SearchModel.pcbsn" class="input-with-select"
                            @keyup.enter="getData">
                        </el-input>
                    </el-form-item>
                    <el-form-item v-show="value === 'ProductCode'" class="mb-2">
                        <el-input :placeholder="t('finishProduct.containerQueries.finishCodePlaceholder')" clearable
                            style="width: 400px" v-model="form.SearchModel.ProductCode" class="input-with-select"
                            @keyup.enter="getData">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getData">{{ t('publicText.query') }}</el-button>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="success" @click="handleExport">{{
                            t('finishProduct.containerQueries.downloadTable') }}</el-button>
                    </el-form-item>
                </el-form>
          
            <el-table ref="tableRef" :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                :height="tableHeight" size="small"  border stripe style="width: 100%">
                <el-table-column prop="rid" :label="t('finishProduct.containerQueries.containerId')"
                    :min-width="getColumnWidth('rid')"></el-table-column>
                <el-table-column prop="pcbsn" :label="t('finishProduct.containerQueries.pcbCode')"
                    :min-width="getColumnWidth('pcbsn')"></el-table-column>
                <el-table-column prop="ProductCode" :label="t('finishProduct.containerQueries.finishCode')"
                    :min-width="getColumnWidth('ProductCode')"> </el-table-column>
                <el-table-column prop="creuser" :label="t('finishProduct.containerQueries.operator')"
                    :min-width="getColumnWidth('creuser')"> </el-table-column>
                <el-table-column prop="cretime" :label="t('finishProduct.containerQueries.operationTime')"
                    :min-width="getColumnWidth('cretime')"> </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 8px">
                <el-pagination size="small" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50, 100]" layout="total,sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { QueryPackingData } from "@/api/finishProduct/containerQueries";
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
const currentPage = ref(1);
const pageSize = ref(20);
const tableHeight = ref(0);
const total = ref(0);

const value = ref("rid");

const options = [
    { value: "rid", label: "finishProduct.containerQueries.containerId" },
    { value: "pcbsn", label: "finishProduct.containerQueries.pcbCode" },
    { value: "ProductCode", label: "finishProduct.containerQueries.finishCode" },
];

const form = reactive({
    PageIndex: 1,
    PageSize: 20,
    SearchText: "",
    SearchModel: {
        id: 0,
        rid: "",
        pcbsn: "",
        barno: "",
        creuser: "",
        ProductCode: "",
        cretime: "",
    },
    StartTime: "",
    EndTime: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [],
});

const getData = () => {
    if (form.SearchModel.rid === "" && form.SearchModel.pcbsn === "" && form.SearchModel.ProductCode === "") {
        ElMessage.warning(t("finishProduct.containerQueries.pleaseInputContent"));
        return;
    }
    const loading = ElLoading.service({
        lock: true,
        text: "Loading...",
        background: "rgba(0, 0, 0, 0.2)",
    });
    QueryPackingData(form).then(({ data }: any) => {
        if (data.Success && data.Data.list !== null) {
            tableData.value = data.Data.list;
            total.value = data.Data.Total;
        } else {
            tableData.value = [];
            form.PageIndex = 1;
        }
        loading.close();
    });
};

const change = () => {
    form.SearchModel = {
        id: 0,
        rid: "",
        pcbsn: "",
        barno: "",
        creuser: "",
        cretime: "",
        ProductCode: "",
    };
};

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
};

const handleExport = async () => {
    if (tableData.value.length === 0) {
        ElMessage.warning(t("finishProduct.containerQueries.emptyList"));
        return;
    }
    try {
        const loading = ElLoading.service({
            lock: true,
            text: "Loading...",
            background: "rgba(0, 0, 0, 0.2)",
        });
        const res: any = await QueryPackingData({ ...form, PageSize: total.value });
        loading.close();
        const allData = res.data.Data.list;
        await exportTableByRef(tableRef.value, allData, {
            fileName: `${t('finishProduct.containerQueries.packingData')}${dayjs().format("YYYYMMDD-HHmmss")}`,
            i18nT: t,
        });
    } catch (error: any) {
        ElMessage.error(error.message || t("publicText.failure"));
    }
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
});

onUnmounted(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style lang="scss" scoped>
.containerQueries {
    padding: 8px;

    .table_header {
        padding-bottom: 8px;
    }
}
</style>
