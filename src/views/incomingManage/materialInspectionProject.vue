<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="flex justify-between">
                <el-form ref="formRef" :model="getForm" label-width="auto" :inline="true" :size="'small'"
                    @submit.native.prevent>
                    <el-form-item :label="t('incomingManage.inspectionRule.materialCode')" prop="materialCode"
                        class="mb-2">
                        <el-input v-model="getForm.MaterialCode"
                            :placeholder="t('incomingManage.inspectionRule.materialCodePlaceholder')" clearable
                            @clear="searchData" @keyup.enter.native="searchData" style="width: 180px" />
                    </el-form-item>
                    <el-form-item :label="t('incomingManage.inspectionRule.materialName')" prop="materialName"
                        class="mb-2">
                        <el-input v-model="getForm.MaterialName"
                            :placeholder="t('incomingManage.inspectionRule.materialNamePlaceholder')" clearable
                            @clear="searchData" @keyup.enter.native="searchData" style="width: 180px" />
                    </el-form-item>
                    <el-form-item :label="t('incomingManage.inspectionRule.materialSpec')" prop="materialSpec"
                        class="mb-2">
                        <el-input v-model="getForm.MaterialSpec"
                            :placeholder="t('incomingManage.inspectionRule.materialSpec')" clearable
                            @clear="searchData" @keyup.enter.native="searchData" style="width: 180px" />
                    </el-form-item>
                    <el-form-item :label="t('incomingManage.inspectionRule.projectCode')" prop="projectCode"
                        class="mb-2">
                        <el-input v-model="getForm.ProjectCode"
                            :placeholder="t('incomingManage.inspectionRule.projectCode')" clearable @clear="searchData"
                            @keyup.enter.native="searchData" style="width: 180px" />
                    </el-form-item>
                    <el-form-item :label="t('incomingManage.inspectionRule.projectName')" prop="projectName"
                        class="mb-2">
                        <el-input v-model="getForm.ProjectName"
                            :placeholder="t('incomingManage.inspectionRule.projectNamePlaceholder')" clearable
                            @clear="searchData" @keyup.enter.native="searchData" style="width: 180px" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button :type="'primary'" @click="searchData">{{ t('publicText.query') }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" size="small" :style="{ width: '100%' }" :height="tableHeight"
                ref="eltableRef" border fit :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('incomingManage.inspectionRule.materialCode')" prop="MaterialCode"
                    :min-width="getColumnWidth('MaterialCode')" />
                <el-table-column :label="t('incomingManage.inspectionRule.materialName')" prop="MaterialName"
                    :min-width="getColumnWidth('MaterialName')" />
                <el-table-column :label="t('incomingManage.inspectionRule.materialSpec')" prop="MaterialSpec"
                    :min-width="getColumnWidth('MaterialSpec')" />
                <el-table-column :label="t('incomingManage.inspectionRule.projectCode')" prop="ProjectCode"
                    :min-width="getColumnWidth('ProjectCode')" />
                <el-table-column :label="t('incomingManage.inspectionRule.projectName')" prop="ProjectName"
                    :min-width="getColumnWidth('ProjectName')" />
                <el-table-column :label="t('incomingManage.inspectionRule.versionNo')" prop="VersionNo"
                    :min-width="getColumnWidth('VersionNo')" />
                <el-table-column :label="t('incomingManage.inspectionRule.isDefault')" prop="IsDefault"
                    :min-width="getColumnWidth('IsDefault')">
                    <template #default="{ row }">
                        <span>{{ row.IsDefault === 1 ? t('publicText.yes') : t('publicText.no') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('publicText.operation')" :fixed="'right'" width="100" :align="'center'">
                    <template #default="{ row }">
                        <el-tooltip :content="$t('publicText.delete')" placement="top">
                            <el-button size="small" type="danger" icon="Delete"
                                @click.stop="handleDelete(row)"></el-button>
                        </el-tooltip>
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
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[10, 20, 30, 50, 100]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    QueryMaterialInspectionProject,
    DeleteMaterialInspectionProject,
} from "@/api/incomingManage/index";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import {
    ref,
    reactive,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";

const userStore = useUserStoreWithOut();
const { t } = useI18n();

// 表格高度自适应
const tableHeight = ref(0);
const eltableRef = ref();

// 主表数据
const tableData = ref<any[]>([]);
const total = ref(0);
const getForm = reactive({
    PageIndex: 1,
    PageSize: 30,
    MaterialCode: "",
    MaterialName: "",
    MaterialSpec: "",
    ProjectCode: "",
    ProjectName: "",
});

// 获取数据
const getData = () => {
    QueryMaterialInspectionProject({
        PageIndex: getForm.PageIndex,
        PageSize: getForm.PageSize,
        MaterialCode: getForm.MaterialCode || undefined,
        MaterialName: getForm.MaterialName || undefined,
        MaterialSpec: getForm.MaterialSpec || undefined,
        ProjectCode: getForm.ProjectCode || undefined,
        ProjectName: getForm.ProjectName || undefined,
    }).then((res: any) => {
        if (res.Success) {
            total.value = res.Data.total;
            tableData.value = res.Data.rows || [];
        } else {
            ElMessage.error(res.Message || "查询失败");
        }
    }).catch(() => {
        ElMessage.error("查询失败");
    });
};

// 查询（重置页码）
const searchData = () => {
    getForm.PageIndex = 1;
    getData();
};

// 分页处理
const handleSizeChange = (val: number) => {
    getForm.PageSize = val;
    getData();
};
const handleCurrentChange = (val: number) => {
    getForm.PageIndex = val;
    getData();
};

// 删除物料已维护的一个检验项目组
const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `${t('publicText.confirm')}${t('publicText.delete')}【${row.MaterialCode} - ${row.ProjectName}】?`,
        t("publicText.confirm"),
        {
            confirmButtonText: t("publicText.confirm"),
            cancelButtonText: t("publicText.cancel"),
            type: "warning",
        }
    )
        .then(() => {
            DeleteMaterialInspectionProject({
                RuleProjectId: row.RuleProjectId,
                RuleId: row.RuleId,
                ProjectCode: row.ProjectCode,
                VersionNo: row.VersionNo,
                DeleteUser: userStore.getUserInfo || "",
                DeleteReason: "",
            }).then((res: any) => {
                if (res.Success) {
                    ElMessage.success(res.Message || "删除成功");
                    getData();
                } else {
                    ElMessage.error(res.Message || "删除失败");
                }
            }).catch(() => {
                ElMessage.error("删除失败");
            });
        })
        .catch(() => {
            ElMessage.info(t("publicText.cancel"));
        });
};

// ==================== 列宽自适应 ====================
const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});

// 高度自适应
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 210;
    });
};

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

<style scoped>
:deep(.el-table .cell) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.el-pagination {
    justify-content: center;
}

.mb-2 {
    margin-bottom: 8px;
}
</style>
