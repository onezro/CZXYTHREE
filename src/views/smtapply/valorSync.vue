<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between items-center">
                <el-form ref="searchFormRef" :inline="true" :model="searchForm" label-width="auto" @submit.prevent>
                    <el-form-item :label="t('smtapply.valorSync.operationName')" class="mb-1">
                        <el-input v-model="searchForm.OperationName"
                            :placeholder="t('smtapply.valorSync.operationNamePlaceholder')" clearable
                            style="width: 250px" size="small" @keyup.enter="handleSearch" />
                    </el-form-item>
                    <el-form-item class="mb-1">
                        <el-button type="primary" size="small" @click="handleSearch">{{ t("publicText.query") }}</el-button>
                        <el-button type="warning" size="small" :loading="syncLoading" @click="handleSync">{{ t("smtapply.valorSync.sync") }}</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="paginatedData" ref="tableRef" border :height="tableHeight"
                stripe size="small" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" :label="t('publicText.index')" width="55" fixed="left" align="center">
                    <template #default="{ $index }">
                        {{ $index + 1 + (currentPage - 1) * pageSize }}
                    </template>
                </el-table-column>
                <el-table-column prop="OperationId" :label="t('smtapply.valorSync.operationId')"
                    :min-width="getColumnWidth('OperationId')" />
                <el-table-column prop="OperationName" :label="t('smtapply.valorSync.operationName')"
                    :min-width="getColumnWidth('OperationName')" show-overflow-tooltip />
                <el-table-column prop="MoveNumType" :label="t('smtapply.valorSync.moveNumType')"
                    :min-width="getColumnWidth('MoveNumType')" align="center" />
                <el-table-column prop="IsRepair" :label="t('smtapply.valorSync.isRepair')"
                    :min-width="getColumnWidth('IsRepair')" align="center">
                    <template #default="{ row }">
                        <el-switch v-model="row.IsRepair" active-value="1" inactive-value="0"
                            @change="handleSwitchChange(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="isMoveInApi" :label="t('smtapply.valorSync.isMoveInApi')"
                    :min-width="getColumnWidth('isMoveInApi')" align="center">
                    <template #default="{ row }">
                        <el-switch v-model="row.isMoveInApi" active-value="1" inactive-value="0"
                            @change="handleSwitchChange(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="isAllocateCodes" :label="t('smtapply.valorSync.isAllocateCodes')"
                    :min-width="getColumnWidth('isAllocateCodes')" align="center">
                    <template #default="{ row }">
                        <el-switch v-model="row.isAllocateCodes" active-value="1" inactive-value="0"
                            @change="handleSwitchChange(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="isTask" :label="t('smtapply.valorSync.isTask')"
                    :min-width="getColumnWidth('isTask')" align="center">
                    <template #default="{ row }">
                        <el-switch v-model="row.isTask" active-value="1" inactive-value="0"
                            @change="handleSwitchChange(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="isMvp" :label="t('smtapply.valorSync.isMvp')"
                    :min-width="getColumnWidth('isMvp')" align="center">
                    <template #default="{ row }">
                        <el-switch v-model="row.isMvp" active-value="1" inactive-value="0"
                            @change="handleSwitchChange(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="isFlip" :label="t('smtapply.valorSync.isFlip')"
                    :min-width="getColumnWidth('isFlip')" align="center">
                    <template #default="{ row }">
                        <el-switch v-model="row.isFlip" active-value="1" inactive-value="0"
                            @change="handleSwitchChange(row)" />
                    </template>
                </el-table-column>
                <el-table-column :label="t('publicText.operation')" width="100" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="openEdit(row)">
                            {{ t("publicText.edit") }}
                        </el-button>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="currentPage"
                    :page-size="pageSize" :page-sizes="[20, 50, 100, 200, 500]"
                    layout="total,sizes,prev,pager,next" :total="total" />
            </div>
        </el-card>

        <!-- 编辑弹窗 -->
        <el-dialog :title="t('smtapply.valorSync.editTitle')" v-model="dialogVisible" width="560px" align-center
            :close-on-click-modal="false">
            <el-form ref="dialogFormRef" :model="dialogForm" label-width="140px">
                <el-form-item :label="t('smtapply.valorSync.operationId')">
                    <el-input v-model="dialogForm.OperationId" disabled />
                </el-form-item>
                <el-form-item :label="t('smtapply.valorSync.operationName')">
                    <el-input v-model="dialogForm.OperationName" disabled />
                </el-form-item>
                <el-form-item :label="t('smtapply.valorSync.moveNumType')">
                    <el-select v-model="dialogForm.MoveNumType" style="width: 100%">
                        <el-option label="1" value="1" />
                        <el-option label="2" value="2" />
                        <el-option label="3" value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('smtapply.valorSync.isRepair')">
                    <el-switch v-model="dialogForm.IsRepair" active-value="1" inactive-value="0" />
                </el-form-item>
                <el-form-item :label="t('smtapply.valorSync.isMoveInApi')">
                    <el-switch v-model="dialogForm.isMoveInApi" active-value="1" inactive-value="0" />
                </el-form-item>
                <el-form-item :label="t('smtapply.valorSync.isAllocateCodes')">
                    <el-switch v-model="dialogForm.isAllocateCodes" active-value="1" inactive-value="0" />
                </el-form-item>
                <el-form-item :label="t('smtapply.valorSync.isTask')">
                    <el-switch v-model="dialogForm.isTask" active-value="1" inactive-value="0" />
                </el-form-item>
                <el-form-item :label="t('smtapply.valorSync.isMvp')">
                    <el-switch v-model="dialogForm.isMvp" active-value="1" inactive-value="0" />
                </el-form-item>
                <el-form-item :label="t('smtapply.valorSync.isFlip')">
                    <el-switch v-model="dialogForm.isFlip" active-value="1" inactive-value="0" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" :loading="dialogLoading" @click="submitDialog">
                    {{ t('publicText.confirm') }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { SyncOperation, QueryOperationPage, UpdateOperationConfig } from "@/api/smtApply/valorSync";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElNotification } from "element-plus";
import type { FormInstance } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const tableRef = ref();
const tableHeight = ref(0);
const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const syncLoading = ref(false);

const paginatedData = ref<any[]>([]);

const searchForm = reactive({
    OperationName: "",
});

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

const queryData = () => {
    const params = {
        OperationName: searchForm.OperationName,
        PageIndex: currentPage.value,
        PageSize: pageSize.value,
    };
    QueryOperationPage(params).then((res: any) => {
        if (res.Success && res.Data) {
            tableData.value = Array.isArray(res.Data.list) ? res.Data.list : [];
            total.value = res.Data.Total || 0;
            paginatedData.value = tableData.value;
        } else {
            tableData.value = [];
            total.value = 0;
            paginatedData.value = [];
        }
    }).catch(() => {
        tableData.value = [];
        total.value = 0;
        paginatedData.value = [];
    });
};

const handleSearch = () => {
    currentPage.value = 1;
    queryData();
};

const handleSync = () => {
    syncLoading.value = true;
    SyncOperation().then((res: any) => {
        if (res.Success && res.Data) {
            const msg = t('smtapply.valorSync.syncSuccessDetail')
                .replace('{source}', res.Data.SourceCount || 0)
                .replace('{insert}', res.Data.InsertCount || 0)
                .replace('{update}', res.Data.UpdateCount || 0);
            ElNotification({
                title: t('smtapply.valorSync.syncSuccess'),
                message: msg,
                type: "success",
                duration: 5000,
            });
            queryData();
        } else {
            ElNotification({
                title: t('publicText.tipTitle'),
                message: res.Message || t('publicText.failure'),
                type: "error",
            });
        }
    }).catch(() => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: t('publicText.failure'),
            type: "error",
        });
    }).finally(() => {
        syncLoading.value = false;
    });
};

const handleSwitchChange = (row: any) => {
    const params = {
        ID: row.ID,
        IsRepair: row.IsRepair,
        isMoveInApi: row.isMoveInApi,
        MoveNumType: row.MoveNumType || "1",
        isAllocateCodes: row.isAllocateCodes,
        isTask: row.isTask,
        isMvp: row.isMvp,
        isFlip: row.isFlip,
    };
    UpdateOperationConfig(params).then((res: any) => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: res.Success ? t('smtapply.valorSync.saveSuccess') : (res.Message || t('publicText.failure')),
            type: res.Success ? "success" : "error",
        });
        if (!res.Success) {
            queryData();
        }
    }).catch(() => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: t('publicText.failure'),
            type: "error",
        });
        queryData();
    });
};

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
    queryData();
};

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    queryData();
};

// 编辑弹窗相关
const dialogVisible = ref(false);
const dialogLoading = ref(false);
const dialogFormRef = ref<FormInstance>();
const dialogForm = reactive({
    ID: "",
    OperationId: "",
    OperationName: "",
    MoveNumType: "1",
    IsRepair: "0",
    isMoveInApi: "0",
    isAllocateCodes: "0",
    isTask: "0",
    isMvp: "0",
    isFlip: "0",
});

const resetDialogForm = () => {
    dialogForm.ID = "";
    dialogForm.OperationId = "";
    dialogForm.OperationName = "";
    dialogForm.MoveNumType = "1";
    dialogForm.IsRepair = "0";
    dialogForm.isMoveInApi = "0";
    dialogForm.isAllocateCodes = "0";
    dialogForm.isTask = "0";
    dialogForm.isMvp = "0";
    dialogForm.isFlip = "0";
};

const openEdit = (row: any) => {
    resetDialogForm();
    dialogForm.ID = row.ID;
    dialogForm.OperationId = row.OperationId;
    dialogForm.OperationName = row.OperationName;
    dialogForm.MoveNumType = row.MoveNumType || "1";
    dialogForm.IsRepair = row.IsRepair || "0";
    dialogForm.isMoveInApi = row.isMoveInApi || "0";
    dialogForm.isAllocateCodes = row.isAllocateCodes || "0";
    dialogForm.isTask = row.isTask || "0";
    dialogForm.isMvp = row.isMvp || "0";
    dialogForm.isFlip = row.isFlip || "0";
    dialogVisible.value = true;
    nextTick(() => {
        dialogFormRef.value?.clearValidate();
    });
};

const submitDialog = () => {
    dialogLoading.value = true;
    const params = {
        ID: dialogForm.ID,
        IsRepair: dialogForm.IsRepair,
        isMoveInApi: dialogForm.isMoveInApi,
        MoveNumType: dialogForm.MoveNumType,
        isAllocateCodes: dialogForm.isAllocateCodes,
        isTask: dialogForm.isTask,
        isMvp: dialogForm.isMvp,
        isFlip: dialogForm.isFlip,
    };
    UpdateOperationConfig(params).then((res: any) => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: res.Success ? t('smtapply.valorSync.saveSuccess') : (res.Message || t('publicText.failure')),
            type: res.Success ? "success" : "error",
        });
        if (res.Success) {
            dialogVisible.value = false;
            queryData();
        }
    }).catch(() => {
        ElNotification({
            title: t('publicText.tipTitle'),
            message: t('publicText.failure'),
            type: "error",
        });
    }).finally(() => {
        dialogLoading.value = false;
    });
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};

onMounted(() => {
    getScreenHeight();
    window.addEventListener("resize", getScreenHeight);
    queryData();
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", getScreenHeight);
});
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}

.mt-2 {
    margin-top: 8px;
}
</style>
