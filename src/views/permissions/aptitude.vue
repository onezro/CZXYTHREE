<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div class="header mb-2">
                <el-button type="primary" size="small" @click="openAdd">{{ t('publicText.add') }}</el-button>
            </div>
            <el-table :data="tableData" border :height="tableHeight" stripe size="small"  :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }"
                :tooltip-effect="'dark'" ref="eltableRef">
                <el-table-column type="index" align="center" fixed :label="t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{ scope.$index + getlistText.pageSize * getlistText.pageIndex + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('permissions.aptitude.operatorId')" prop="OperatorID" align="center"
                    :min-width="getColumnWidth('OperatorID')" />
                <el-table-column :label="t('permissions.aptitude.qualification')" prop="Qualification" align="center"
                    :min-width="getColumnWidth('Qualification')">
                    <template #default="{ row }">
                        <el-tag :type="row.Qualification == 1 ? '' : 'warning'" size="small">
                            {{ row.Qualification == 1 ? "NPM" : row.Qualification == 2 ? "DEK" : "AOI" }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('permissions.aptitude.created')" prop="Created" align="center"
                    :min-width="getColumnWidth('Created')" show-overflow-tooltip />
                <el-table-column :label="t('permissions.aptitude.expired')" prop="Expired" align="center"
                    :min-width="getColumnWidth('Expired')" show-overflow-tooltip />
                <el-table-column fixed="right" :label="t('publicText.operation')" align="center" width="100">
                    <template #default="{ row }">
                        <el-tooltip :content="t('publicText.delete')" placement="top">
                            <el-button type="danger" size="small" icon="Delete"
                                @click="handleDelete(row)" />
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
                <el-pagination size="small" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :current-page="currentPage" :pager-count="5"
                    :page-size="getlistText.pageSize" :page-sizes="[5, 10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div>
        </el-card>

        <!-- 新增弹窗 -->
        <el-dialog :title="t('publicText.add')" v-model="dialogVisible" width="50%"
            :close-on-click-modal="false" @closed="handleDialogClosed">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" size="small">
                <el-form-item :label="t('permissions.aptitude.operatorId')" prop="OperatorID">
                    <el-input v-model="form.OperatorID" :placeholder="t('permissions.aptitude.inputOperatorId')" />
                </el-form-item>
                <el-form-item :label="t('permissions.aptitude.qualification')" prop="Qualification">
                    <el-select v-model="form.Qualification" :placeholder="t('permissions.aptitude.inputQualification')">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('permissions.aptitude.created')" prop="Created">
                    <el-date-picker v-model="form.Created" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss" :placeholder="t('permissions.aptitude.selectDateTime')" />
                </el-form-item>
                <el-form-item :label="t('permissions.aptitude.expired')" prop="Expired">
                    <el-date-picker v-model="form.Expired" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss" :placeholder="t('permissions.aptitude.selectDateTime')" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">{{ t('publicText.cancel') }}</el-button>
                <el-button type="primary" @click="onSubmit">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    savePersonQualification,
    deletePersonQualification,
    getPagePersonQualification,
} from "@/api/permiss/aptitude";
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const eltableRef = ref();
const formRef = ref();
const tableHeight = ref(0);
const loading = ref(false);
const dialogVisible = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);

const getlistText = reactive({
    pageIndex: 0,
    pageSize: 50,
    searchText: "",
    SearchModel: {},
});

const form = reactive({
    OperatorID: "",
    Qualification: "" as string | number,
    Expired: "",
    Created: "",
});

const typeList = [
    { label: "NPM", value: 1 },
    { label: "DEK", value: 2 },
    { label: "AOI", value: 3 },
];

const rules = reactive({
    OperatorID: [{ required: true, message: t("permissions.aptitude.inputOperatorId"), trigger: "blur" }],
    Qualification: [{ required: true, message: t("permissions.aptitude.inputQualification"), trigger: "blur" }],
    Expired: [{ required: true, message: t("permissions.aptitude.inputExpired"), trigger: "blur" }],
    Created: [{ required: true, message: t("permissions.aptitude.inputCreated"), trigger: "blur" }],
});

const { getColumnWidth } = useTableColumnWidth(eltableRef, tableData, {
    excludeLabels: [t("publicText.index"), t("publicText.operation")],
});

const getData = () => {
    loading.value = true;
    getPagePersonQualification(getlistText)
        .then((res: any) => {
            if (res.Success) {
                total.value = res.Data.Total;
                tableData.value = res.Data.list;
            } else {
                ElMessageBox.alert(res.Msg, t("publicText.tipTitle"), {
                    confirmButtonText: t("publicText.confirm"),
                });
            }
        })
        .catch(() => { })
        .finally(() => {
            loading.value = false;
        });
};

const handleDelete = (row: any) => {
    ElMessageBox.confirm(t("permissions.aptitude.deleteConfirm"), t("publicText.tip"), {
        confirmButtonText: t("publicText.confirm"),
        cancelButtonText: t("publicText.cancel"),
        type: "warning",
    })
        .then(() => {
            deletePersonQualification({
                OperatorID: row.OperatorID,
                Qualification: row.Qualification,
                Expired: row.Expired,
                Created: row.Created,
            }).then((res: any) => {
                if (res.Success) {
                    if (tableData.value.length == 1 && getlistText.pageIndex > 0) {
                        getlistText.pageIndex--;
                        currentPage.value--;
                    }
                    getData();
                    ElMessage.success(t("permissions.aptitude.deleteSuccess"));
                } else {
                    ElMessageBox.alert(res.Msg, t("publicText.tipTitle"), {
                        confirmButtonText: t("publicText.confirm"),
                    });
                }
            });
        })
        .catch(() => { });
};

const onSubmit = () => {
    formRef.value.validate((valid: boolean) => {
        if (!valid) return;
        loading.value = true;
        savePersonQualification(form)
            .then((res: any) => {
                if (res.Success) {
                    dialogVisible.value = false;
                    getData();
                    ElMessage.success(t("permissions.aptitude.addSuccess"));
                } else {
                    ElMessageBox.alert(res.Msg, t("publicText.tipTitle"), {
                        confirmButtonText: t("publicText.confirm"),
                    });
                }
            })
            .catch(() => { })
            .finally(() => {
                loading.value = false;
            });
    });
};

const handleDialogClosed = () => {
    formRef.value?.resetFields();
};

const openAdd = () => {
    dialogVisible.value = true;
};

const handleSizeChange = (val: number) => {
    getlistText.pageSize = val;
    getData();
};

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    getlistText.pageIndex = val - 1;
    getData();
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 180;
    });
};

onMounted(() => {
    getScreenHeight();
    window.addEventListener("resize", getScreenHeight);
    getData();
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
