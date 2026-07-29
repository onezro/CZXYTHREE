<template>
    <div class="snQuery">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
           
                <el-form class="form" :inline="true" size="small">
                    <div class="flex-container">
                        <div>
                            <el-form-item :label="t('finishProduct.snQuery.pcbId')" class="mb-2">
                                <el-input clearable style="width: 180px" v-model="form.SearchModel.PcbID"
                                    class="input-with-select" @keyup.enter="dataSubmit">
                                </el-input>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.snQuery.blockId')" class="mb-2">
                                <el-input clearable style="width: 180px" v-model="form.SearchModel.BlockID"
                                    class="input-with-select" @keyup.enter="dataSubmit">
                                </el-input>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.snQuery.workOrder')" class="mb-2">
                                <el-input clearable style="width: 180px" v-model="form.SearchModel.OrderNo"
                                    class="input-with-select" @keyup.enter="dataSubmit">
                                </el-input>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.snQuery.time')" class="mb-2">
                                <el-date-picker v-model="date" type="datetimerange"
                                    :range-separator="t('finishProduct.snQuery.to')"
                                    :start-placeholder="t('finishProduct.snQuery.startDate')" style="width: 350px"
                                    :end-placeholder="t('finishProduct.snQuery.endDate')"
                                    value-format="YYYY-MM-DD HH:mm:ss" :shortcuts="shortcuts"
                                    :default-time="defaultTime" :clearable="false">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item class="mb-2">
                                <el-button type="primary" @click="dataSubmit">{{ t('publicText.query') }}</el-button>
                            </el-form-item>
                        </div>
                        <el-form-item class="mb-2">
                            <el-button type="success" @click="handleExport">{{ t('finishProduct.snQuery.downloadTable')
                                }}</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            <el-table ref="tableRef" :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                :height="tableHeight" size="small" border stripe style="width: 100%">
                <el-table-column prop="OrderNo" :label="t('finishProduct.snQuery.workOrder')"
                    :min-width="getColumnWidth('OrderNo')"></el-table-column>
                <el-table-column prop="PcbID" :label="t('finishProduct.snQuery.pcbId')"
                    :min-width="getColumnWidth('PcbID')"></el-table-column>
                <el-table-column prop="BlockID" :label="t('finishProduct.snQuery.blockId')"
                    :min-width="getColumnWidth('BlockID')">
                </el-table-column>
                <el-table-column prop="BlockNo" :label="t('finishProduct.snQuery.serialNo')" width="55">
                </el-table-column>
                <el-table-column prop="ReadTime" :label="t('finishProduct.snQuery.readTime')"
                    :min-width="getColumnWidth('ReadTime')"> </el-table-column>
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
import { QueryPCBBoardData } from "@/api/finishProduct/snQuery";
import { exportTableByRef } from "@/utils/exportExcel/generalExportExcel";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessage, ElLoading } from "element-plus";
import { ref, reactive, watch, onMounted, onBeforeMount, onUnmounted, nextTick } from "vue";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
import dayjs from "dayjs";

const { t } = useI18n();

const tableRef = ref();

const heardStyle = {
    background: "rgb(102, 146, 217)",
    color: "#ffffff",
};

const tableData = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(50);
const tableHeight = ref(0);
const total = ref(0);

const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)];

const date = ref<[string, string]>([setLastDate() as string, setTodayDate() as string]);

const form = reactive({
    PageIndex: 1,
    PageSize: 50,
    SearchText: "",
    SearchModel: {
        PcbID: "",
        BlockID: "",
        OrderNo: "",
    },
    StartTime: "",
    EndTime: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [],
});

watch(date, (newValue) => {
    if (newValue) {
        form.StartTime = newValue[0];
        form.EndTime = newValue[1];
    } else {
        form.StartTime = "";
        form.EndTime = "";
    }
}, { immediate: true });

const getData = () => {
    const loading = ElLoading.service({
        lock: true,
        text: "Loading...",
        background: "rgba(0, 0, 0, 0.2)",
    });
    QueryPCBBoardData(form).then(({ data }: any) => {
        if (data.Success) {
            tableData.value = data.Data.list;
            total.value = data.Data.Total;
        } else {
            tableData.value = [];
            form.PageIndex = 1;
        }
        loading.close();
    });
};

const dataSubmit = () => {
    form.PageIndex = 1;
    form.PageSize = 50;
    currentPage.value = 1;
    getData();
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
        ElMessage.warning(t("finishProduct.snQuery.emptyList"));
        return;
    }
    try {
        const loading = ElLoading.service({
            lock: true,
            text: "Loading...",
            background: "rgba(0, 0, 0, 0.2)",
        });
        const res: any = await QueryPCBBoardData({ ...form, PageSize: total.value });
        loading.close();
        const allData = res.data.Data.list;
        await exportTableByRef(tableRef.value, allData, {
            fileName: `${t('finishProduct.snQuery.pcbSn')}${dayjs().format("YYYYMMDD-HHmmss")}`,
            i18nT: t,
        });
    } catch (error: any) {
        ElMessage.error(error.message || t("publicText.failure"));
    }
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};

onBeforeMount(() => {
    date.value = [setLastDate() as string, setTodayDate() as string];
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
.snQuery {
    padding: 8px;

    .table_header {
        padding-bottom: 8px;
    }
}

.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
</style>
