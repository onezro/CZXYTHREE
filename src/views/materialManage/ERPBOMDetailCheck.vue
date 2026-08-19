<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('materialManage.erpBomDetailCheck.materialcode')" class="mb-2">
                        <el-input v-model="searchForm.materialcode"
                            :placeholder="t('materialManage.erpBomDetailCheck.materialcodePlaceholder')" clearable
                            style="width: 220px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item :label="t('materialManage.erpBomDetailCheck.bomversion')" class="mb-2">
                        <el-input v-model="searchForm.bomversion"
                            :placeholder="t('materialManage.erpBomDetailCheck.bomversionPlaceholder')" clearable
                            style="width: 160px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" size="small" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button size="small" @click="resetSearch">{{ t("publicText.reset") }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="tableData" ref="tableRef" border :height="tableHeight"
                stripe size="small" v-loading="loading"
                :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="code" :label="t('materialManage.erpBomDetailCheck.code')"
                    :min-width="getColumnWidth('code')" fixed="left" show-overflow-tooltip />
                <el-table-column prop="name" :label="t('materialManage.erpBomDetailCheck.name')"
                    :min-width="getColumnWidth('name')" show-overflow-tooltip fixed="left"/>
                <el-table-column prop="hversion" :label="t('materialManage.erpBomDetailCheck.hversion')"
                    :min-width="getColumnWidth('hversion')" align="center" />
                <el-table-column prop="cmaterialcode" :label="t('materialManage.erpBomDetailCheck.cmaterialcode')"
                    :min-width="getColumnWidth('cmaterialcode')" show-overflow-tooltip />
                <el-table-column prop="cmaterialvidname" :label="t('materialManage.erpBomDetailCheck.cmaterialvidname')"
                    :min-width="getColumnWidth('cmaterialvidname')" show-overflow-tooltip />
                <el-table-column prop="cmaterialvidversion" :label="t('materialManage.erpBomDetailCheck.cmaterialvidversion')"
                    :min-width="getColumnWidth('cmaterialvidversion')" align="center" />
                <el-table-column prop="RES16" :label="t('materialManage.erpBomDetailCheck.res16')"
                    :min-width="getColumnWidth('RES16')" show-overflow-tooltip />
                <el-table-column prop="vrowno" :label="t('materialManage.erpBomDetailCheck.vrowno')"
                    :min-width="getColumnWidth('vrowno')" align="center" />
                <el-table-column prop="nitemnum" :label="t('materialManage.erpBomDetailCheck.nitemnum')"
                    :min-width="getColumnWidth('nitemnum')" align="right" />
                <el-table-column prop="cassmeasureid" :label="t('materialManage.erpBomDetailCheck.cassmeasureid')"
                    :min-width="getColumnWidth('cassmeasureid')" align="center" />
                <el-table-column prop="whcode" :label="t('materialManage.erpBomDetailCheck.whcode')"
                    :min-width="getColumnWidth('whcode')" align="center" />
                <el-table-column prop="fbillstatus" :label="t('materialManage.erpBomDetailCheck.fbillstatus')"
                    width="100" :min-width="getColumnWidth('fbillstatus')" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.fbillstatus" :type="getFbillstatusType(row.fbillstatus)" size="small">
                            {{ row.fbillstatus }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="loadstatus" :label="t('materialManage.erpBomDetailCheck.loadstatus')"
                    :min-width="getColumnWidth('loadstatus')" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.loadstatus === 0 ? 'info' : 'success'" size="small">
                            {{ getLoadstatusText(row.loadstatus) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="deletestatus" :label="t('materialManage.erpBomDetailCheck.deletestatus')"
                    :min-width="getColumnWidth('deletestatus')" align="center" />
                <el-table-column prop="update_date" :label="t('materialManage.erpBomDetailCheck.updateDate')"
                    :min-width="getColumnWidth('update_date')" align="center">
                    <template #default="{ row }">
                        {{ formatDate(row.update_date) }}
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <div class="mt-2">
                <el-pagination size="small" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage"
                    :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { QueryKhsapBomPage } from "@/api/materialManage/index";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import dayjs from "dayjs";

const { t } = useI18n();

const loading = ref(false);
const tableHeight = ref(0);
const tableRef = ref();

const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);
const tableData = ref<any[]>([]);

const searchForm = reactive({
    materialcode: "",
    bomversion: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t("publicText.index")],
});

// 查询
const getData = async () => {
    if (!searchForm.materialcode) {
        ElMessage.warning(t("materialManage.erpBomDetailCheck.pleaseInputMaterialcode"));
        return;
    }
    loading.value = true;
    try {
        const params = {
            materialcode: searchForm.materialcode,
            bomversion: searchForm.bomversion,
            PageIndex: currentPage.value,
            PageSize: pageSize.value,
        };
        const res: any = await QueryKhsapBomPage(params);
        if (res.Success) {
            if (res.Data && Array.isArray(res.Data.rows)) {
                tableData.value = res.Data.rows;
                total.value = res.Data.total || res.Data.rows.length;
            } else if (res.Data && Array.isArray(res.Data)) {
                tableData.value = res.Data;
                total.value = res.Data.length;
            } else {
                tableData.value = [];
                total.value = 0;
            }
        } else {
            ElMessage.error(res.Message || t("materialManage.erpBomDetailCheck.queryFailure"));
        }
    } catch (error) {
        ElMessage.error(t("materialManage.erpBomDetailCheck.queryFailure"));
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    currentPage.value = 1;
    getData();
};

const resetSearch = () => {
    searchForm.materialcode = "";
    searchForm.bomversion = "";
    currentPage.value = 1;
    tableData.value = [];
    total.value = 0;
};

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
    getData();
};

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    getData();
};

const getFbillstatusType = (status: string) => {
    if (status === "有效版本") return "success";
    if (status === "失效版本" || status === "已删除") return "danger";
    return "info";
};

const getLoadstatusText = (status: number) => {
    return status === 0 ? t("publicText.notStarted") : t("publicText.completed");
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
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

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
