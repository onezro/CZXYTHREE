<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center mb-2">
                <div></div>
                <div class="input_box">
                    <el-input v-model="searchName" style="width: 350px" clearable
                        :placeholder="$t('deviceManage.fixtureIssue.searchPlaceholder')"
                        @keyup.enter.native="searchData" @clear="clearData" size="small">
                        <template #append>
                            <el-button type="primary" :icon="Search" @click="searchData" />
                        </template>
                    </el-input>
                </div>
            </div>

            <el-table ref="tableRef"  :data="paginatedData" border :height="tableHeight"
                style="width: 100%" size="small" stripe highlight-current-row>
                <el-table-column prop="WO" :label="$t('deviceManage.fixtureIssue.issueNo')"
                    :min-width="getColumnWidth('WO')" />
                <el-table-column prop="PD_model" :label="$t('deviceManage.fixtureIssue.productModel')"
                    :min-width="getColumnWidth('PD_model')" />
                <el-table-column prop="Plan_qty" :label="$t('deviceManage.fixtureIssue.planQty')" align="center"
                    :min-width="getColumnWidth('Plan_qty')" />
                <el-table-column prop="erp_wo_type" :label="$t('deviceManage.fixtureIssue.type')" align="center"
                    :min-width="getColumnWidth('erp_wo_type')">
                    <template #default="{ row }">
                        <el-tag v-if="row.erp_wo_type === 'D' || row.erp_wo_type === 'D1'" type="primary">
                            {{ $t("deviceManage.fixtureType.printFixture") }}
                        </el-tag>
                        <el-tag v-else-if="row.erp_wo_type === 'D2'" type="success">
                            {{ $t("deviceManage.fixtureType.ictFixture") }}
                        </el-tag>
                        <el-tag v-else-if="row.erp_wo_type === 'D3'" type="info">
                            {{ $t("deviceManage.fixtureType.sample") }}
                        </el-tag>
                        <el-tag v-else-if="row.erp_wo_type === 'E'" type="warning">
                            {{ $t("deviceManage.fixtureIssue.assemblyFixture") }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="Plan_dt" :label="$t('deviceManage.fixtureIssue.planTime')"
                    width="160"  />
                <el-table-column prop="Crt_dt" :label="$t('deviceManage.fixtureIssue.createTime')"
                    width="160" />
                
                <template #empty>
                    <el-empty :description="$t('publicText.noData')" />
                </template>
            </el-table>

            <div style="margin-top: 8px">
                <el-pagination align="center" background size="small" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next"
                    :total="filteredData.length" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { queryToolsOrder } from "@/api/deviceManage/fixture";
import { calculateColumnsWidth } from "@/utils/tableminWidth";
import dayjs from "dayjs";

const { t } = useI18n();

// ---------- 表格数据 ----------
const tableRef = ref();
const tableData = ref<any[]>([]);
const filteredData = ref<any[]>([]);
const loading = ref(false);
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

// ---------- 查询参数 ----------
const queryParams = reactive({
    toolsOrder: "*",
    startTime: "",
    endTime: "",
    status: 0,
    operationType: "A", // A: 查询所有
});

// ---------- API 交互 ----------
const getData = async () => {
    loading.value = true;
    try {
        const res: any = await queryToolsOrder(queryParams);
        if (res.Success) {
            tableData.value = res.Data.map((item: any) => ({
                ...item,
                Crt_dt: item.Crt_dt ? dayjs(item.Crt_dt).format("YYYY-MM-DD HH:mm:ss") : "",
                Plan_dt: item.Plan_dt ? dayjs(item.Plan_dt).format("YYYY-MM-DD HH:mm:ss") : "",
            }));
            filteredData.value = [...tableData.value];
            // 修复分页边界
            if (filteredData.value.length === 0 && currentPage.value > 1) {
                currentPage.value--;
            }
        } else {
            ElMessage.error(t("message.queryFailure"));
            tableData.value = [];
            filteredData.value = [];
        }
    } catch (error) {
        console.error("请求数据失败:", error);
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
                (item.WO && item.WO.toLowerCase().includes(keyword)) ||
                (item.PD_model && item.PD_model.toLowerCase().includes(keyword))
        );
    }
    currentPage.value = 1;
};

const clearData = () => {
    searchName.value = "";
    filteredData.value = [...tableData.value];
    currentPage.value = 1;
};

// 分页
const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
};
const handleCurrentChange = (val: number) => {
    currentPage.value = val;
};

// 表格高度自适应
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};

// 生命周期
onBeforeMount(() => {
    getScreenHeight();
});

onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
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