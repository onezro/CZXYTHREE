<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <!-- 搜索栏 -->
            <el-form ref="formRef" :inline="true" size="small" label-width="auto" @submit.native.prevent>
                <el-form-item :label="t('Scheduling.PrepareMaterials.WOGroup')" prop="WOGroup" class="mb-2">
                    <el-input v-model="getForm.WOGroup" clearable @clear="getData"
                        @keyup.enter.native="getData" style="width: 160px" />
                </el-form-item>
                <el-form-item :label="t('Scheduling.PrepareMaterials.Line')" prop="Line" class="mb-2">
                    <el-select v-model="getForm.Line" clearable filterable
                        :placeholder="t('publicText.pleaseSelect')" style="width: 140px" @change="getData">
                        <el-option v-for="item in lineList" :key="item.line" :label="item.line" :value="item.line" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('Scheduling.PrepareMaterials.Status')" prop="Status" class="mb-2">
                    <el-select v-model="getForm.Status" clearable
                        :placeholder="t('publicText.pleaseSelect')" style="width: 120px" @change="getData">
                        <el-option :label="t('Scheduling.PrepareMaterials.Status0')" :value="0" />
                        <el-option :label="t('Scheduling.PrepareMaterials.Status1')" :value="1" />
                        <el-option :label="t('Scheduling.PrepareMaterials.Status99')" :value="99" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('Scheduling.PrepareMaterials.IsKitted')" prop="IsKitted" class="mb-2">
                    <el-select v-model="getForm.IsKitted" clearable
                        :placeholder="t('publicText.pleaseSelect')" style="width: 100px" @change="getData">
                        <el-option :label="t('Scheduling.PrepareMaterials.IsKitted1')" :value="1" />
                        <el-option :label="t('Scheduling.PrepareMaterials.IsKitted0')" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="t('Scheduling.PrepareMaterials.KittingStatus')" prop="KittingStatus" class="mb-2">
                    <el-select v-model="getForm.KittingStatus" clearable
                        :placeholder="t('publicText.pleaseSelect')" style="width: 100px" @change="getData">
                        <el-option :label="t('Scheduling.PrepareMaterials.KittingStatus0')" :value="0" />
                        <el-option :label="t('Scheduling.PrepareMaterials.KittingStatus1')" :value="1" />
                        <el-option :label="t('Scheduling.PrepareMaterials.KittingStatus2')" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item class="mb-2">
                    <el-button :type="'primary'" @click="getData">{{ t('publicText.query') }}</el-button>
                    <el-button @click="handleReset">{{ t('publicText.reset') }}</el-button>
                    <el-button :type="'primary'" :disabled="selectList.length !== 1" @click="handleGenerateCall">
                        {{ t('Scheduling.PrepareMaterials.generateCall') }}
                    </el-button>
                    <el-button :type="'warning'" :disabled="selectList.length !== 1" @click="addMaterial">{{ t('Scheduling.PrepareMaterials.StatusType2')
                    }}</el-button>
                </el-form-item>
            </el-form>

            <!-- 备料单列表 -->
            <el-table ref="tableMasterRef" :data="tableData" size="small" :style="{ width: '100%' }"
                :height="tableHeight" :tooltip-effect="'dark'" border fit @selection-change="handleSelectionChange"
                @row-click="fetchDetail" highlight-current-row :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + getForm.PageSize * (getForm.PageIndex - 1) + 1
                            }}</span>
                    </template>
                </el-table-column>
                 <el-table-column :label="t('Scheduling.PrepareMaterials.WOGroup')" fixed prop="WOGroup"
                    :min-width="getColumnWidth1('WOGroup')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.PreparationNo')" fixed
                    prop="MaterialPreparationNo" :min-width="getColumnWidth1('MaterialPreparationNo')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.Line')" prop="Line"
                    :min-width="getColumnWidth1('Line')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.PlanStartTime')" prop="PlanStartTime"
                    :min-width="getColumnWidth1('PlanStartTime')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.PlanEndTime')" prop="PlanEndTime"
                    :min-width="getColumnWidth1('PlanEndTime')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.MaterialPreparationStatus')" prop="MaterialPreparationStatusText"
                    :min-width="getColumnWidth1('MaterialPreparationStatusText')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.IsKitted')" prop="IsKittedText"
                    :min-width="getColumnWidth1('IsKittedText')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.KittingStatus')" prop="KittingStatusText"
                    :min-width="getColumnWidth1('KittingStatusText')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.Description')" prop="Description"
                    :min-width="getColumnWidth1('Description')" />
                <el-table-column fixed="right" :label="$t('publicText.operation')" width="80" align="center">
                    <template #default="scope">
                        <el-tooltip :content="t('Scheduling.PrepareMaterials.resendPrepare')" placement="top">
                            <el-button :type="'info'" size="small" icon="Refresh" @click="handleResend(scope.row)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>

            <!-- 分页 -->
            <div class="mt-2 mb-1">
                <el-pagination :size="'small'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageIndex"
                    :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>

            <!-- 备料单明细 -->
            <el-table :data="tableData2.slice(
                (pageObj.currentPage - 1) * pageObj.pageSize,
                pageObj.currentPage * pageObj.pageSize,
            )
                " size="small" :style="{ width: '100%' }" :height="tableHeight2" :tooltip-effect="'dark'" border fit
                ref="tableDetailRef" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                <el-table-column type="index" align="center" fixed :label="$t('publicText.index')" width="50">
                    <template #default="scope">
                        <span>{{
                            scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
                        }}</span>
                    </template>
                </el-table-column>
               
                <el-table-column :label="t('Scheduling.PrepareMaterials.MaterialWo')" prop="MaterialWo"
                    :min-width="getColumnWidth2('MaterialWo')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.MaterialPn')" prop="MaterialPn"
                    :min-width="getColumnWidth2('MaterialPn')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.MaterialPnName')" prop="MaterialPnName"
                    :min-width="getColumnWidth2('MaterialPnName')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.MaterialPnDesc')" prop="MaterialPnDesc"
                    :min-width="getColumnWidth2('MaterialPnDesc')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.MaterialQty')" prop="MaterialQty"
                    :min-width="getColumnWidth2('MaterialQty')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.LockNum1')" prop="LockNum1"
                    :min-width="getColumnWidth2('LockNum1')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.LockNum2')" prop="LockNum2"
                    :min-width="getColumnWidth2('LockNum2')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.LotNumber')" prop="LotNumber"
                    :min-width="getColumnWidth2('LotNumber')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.RequestNo')" prop="RequestNo"
                    :min-width="getColumnWidth2('RequestNo')" />
                <el-table-column :label="t('Scheduling.PrepareMaterials.RemainingQty')" prop="RemainingQty"
                    :min-width="getColumnWidth2('RemainingQty')" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.RemainingQty == 0" type="success" size="small">{{ t('Scheduling.PrepareMaterials.Kitted') }}</el-tag>
                        <span v-else>{{ scope.row.RemainingQty }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="t('Scheduling.PrepareMaterials.SatisfiedTime')" prop="SatisfiedTime"
                    :min-width="getColumnWidth2('SatisfiedTime')" />
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty />
                    </div>
                </template>
            </el-table>
            <div class="mt-2">
                <el-pagination :size="'small'" background @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1" :pager-count="5" :current-page="pageObj.currentPage"
                    :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="tableData2.length">
                </el-pagination>
            </div>
        </el-card>
        <el-dialog v-model="addVisible" :title="t('Scheduling.PrepareMaterials.AddSupplement')" width="700px"
            @closed="handleAddDialogClosed" align-center :close-on-click-modal="false">
            <el-form ref="addFormRef" :model="addForm" label-width="auto">
                <el-form-item :label="t('Scheduling.PrepareMaterials.WOGroup')" prop="WOGroup">
                    <el-input v-model="addForm.WOGroup" disabled />
                </el-form-item>
                <el-form-item :label="t('Scheduling.PrepareMaterials.Reason')" prop="Reason">
                    <el-input v-model="addForm.Reason" placeholder="" clearable type="textarea" />
                </el-form-item>
                <div class="mb-2">
                    <el-button type="primary" size="small" icon="Plus" @click="addMaterialRow">
                        {{ t('publicText.add') }}
                    </el-button>
                </div>
                <el-table :data="addForm.MaterialList" border size="small" style="width: 100%" height="300" :header-cell-style="{ backgroundColor: '#006487', color: '#fff' }">
                    <el-table-column type="index" align="center" :label="t('publicText.index')" width="55" />
                    <el-table-column :label="t('Scheduling.PrepareMaterials.MaterialPN')" >
                        <template #default="scope">
                            <el-select v-model="scope.row.MaterialPN" filterable clearable size="small"
                                :placeholder="t('publicText.pleaseSelect')" style="width: 100%"
                                @change="(val: any) => handleMaterialChange(scope.$index, scope.row, val)">
                                <el-option v-for="item in currentMaterialList" :key="item.MaterialPn"
                                    :label="item.MaterialPn + ' - ' + item.MaterialPnName"
                                    :value="item.MaterialPn"
                                    :disabled="isMaterialSelected(item.MaterialPn, scope.$index)" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('Scheduling.PrepareMaterials.Qty')" width="150">
                        <template #default="scope">
                            <el-input size="small" v-model.number="scope.row.Qty" type="number" clearable />
                        </template>
                    </el-table-column>
                    <el-table-column :label="t('publicText.operation')" width="100" align="center">
                        <template #default="scope">
                            <el-button type="danger" size="small" icon="Delete"
                                @click="removeMaterialRow(scope.$index)" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">{{ t('publicText.cancel') }}</el-button>
                    <el-button type="primary" @click="submitAddForm" :loading="submitLoading">{{ t('publicText.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 错误信息弹窗 -->
        <el-dialog v-model="errorDialogVisible" title="重新发送备料错误信息" width="600px" custom-class="error-dialog"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center>
            <div class="error-content">
                <div class="error-summary">
                    <el-icon class="summary-icon">
                        <Warning />
                    </el-icon>
                    <span>本次重新发送备料共出现 <strong>{{ currentErrors.length }}</strong> 个错误</span>
                </div>
                <el-scrollbar height="300px">
                    <div v-for="(error, index) in currentErrors" :key="index" class="error-item">
                        <div class="error-index">{{ index + 1 }}</div>
                        <div class="error-info">
                            <div class="error-header">
                                <span class="device-name">{{ error.MaterialPreparationNo }}</span>
                            </div>
                            <div class="error-details">
                                <span class="detail-item">{{ t('Scheduling.PrepareMaterials.WOGroup') }}: {{ error.WOGroup }}</span>
                            </div>
                            <div class="error-message">
                                <el-icon>
                                    <CloseCircle />
                                </el-icon>
                                {{ error.errorMsg }}
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="danger" @click="errorDialogVisible = false">{{ t('publicText.close') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { QueryMaterialPreparationList, QueryMaterialPreparationDetail, GenerateMaterialRequest, AddSupplementMaterialPreparation, ManualCreateSaiYiPreparePlan } from "@/api/Scheduling/index"
import {
    GetSMTValorLine
} from "@/api/smtApply/changeover";
import { useTableColumnWidth } from '@/hooks/useTableColumnWidth';
import {
    ref,
    reactive,
    computed,
    nextTick,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import { Warning } from "@element-plus/icons-vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
import { useI18n } from "vue-i18n";
const { t } = useI18n();

// ---------- 高度自适应 ----------
const tableHeight = ref(0);
const tableHeight2 = ref(0);



// ---------- 表格数据 ----------
const tableData = ref([]); // 备料单列表
const tableData2 = ref([
]); // 备料单明细
const total = ref(0);
const selectList = ref<any>([]);

const getForm = ref({
    PageIndex: 1,
    PageSize: 50,
    WOGroup: "",
    Line: "",
    Status: "",
    IsKitted: "",
    KittingStatus: "",
});
const lineList = ref<any[]>([]);
const tableRef = ref()
const addVisible = ref(false)
const submitLoading = ref(false)
const addForm = ref({
    WOGroup: "",
    Reason: "",
    MaterialList: [
        {
            MaterialPN: "",
            Qty: "",
            LineKey:''
        }
    ]
})
const addFormRef = ref()

const currentMaterialList = ref<any[]>([])

const woGroupOptions = computed(() => {
    const map = new Map<string, any>()
    tableData.value.forEach((item: any) => {
        if (item.WOGroup && !map.has(item.WOGroup)) {
            map.set(item.WOGroup, item)
        }
    })
    return Array.from(map.values())
})

const handleWOGroupChange = (val: string) => {
    currentMaterialList.value = []
    if (!val) return
    const matched:any = tableData.value.find((item: any) => item.WOGroup === val)
    if (matched && matched.MaterialPreparationNo) {
        QueryMaterialPreparationDetail({ MaterialPreparationNo: matched.MaterialPreparationNo }).then((res: any) => {
            if (res.Success && res.Data) {
                currentMaterialList.value = res.Data
            }
        })
    }
}

const isMaterialSelected = (materialPn: string, currentIndex: number) => {
    return addForm.value.MaterialList.some((item: any, index: number) =>
        index !== currentIndex && item.MaterialPN === materialPn
    )
}

const handleMaterialChange = (index: number, row: any, val: string) => {
    if (!val) return
    if (isMaterialSelected(val, index)) {
        ElMessage.warning(t('Scheduling.PrepareMaterials.materialDuplicate'))
        row.MaterialPN = ""
        row.Qty = ""
        return
    }
    const matched = currentMaterialList.value.find((item: any) => item.MaterialPn === val)
    if (matched) {
        row.MaterialPN = matched.MaterialPn
        row.Qty = matched.MaterialQty || ""
    }
}

interface ResendError {
    MaterialPreparationNo: string;
    WOGroup: string;
    errorMsg: string;
}

const currentErrors = ref<ResendError[]>([]);
const errorDialogVisible = ref(false);
const pageObj = reactive({
    currentPage: 1,
    pageSize: 50,
});
const tableMasterRef = ref()
const tableDetailRef = ref()
// ---------- 接口调用 ----------
const getLineList = () => {
    GetSMTValorLine({}).then((res: any) => {
        if (res.Success && res.Data) {
            lineList.value = res.Data;
        }
    });
};

const getData = () => {
    QueryMaterialPreparationList(getForm.value).then((res: any) => {
        if (res.Success) {
            total.value = res.Data.total;
            tableData.value = res.Data.rows;
        }
    });
};
const getStatusTagType = (status: number) => {
    switch (status) {
        case 0:
            return "info";
        case 1:
            return "warning";
        case 2:
            return "success";
        default:
            return "";
    }
};
const getStatusText = (status: number) => {
    switch (status) {
        case 0:
            return t('Scheduling.PrepareMaterials.Status0');
        case 1:
            return t('Scheduling.PrepareMaterials.Status1');
        case 2:
            return t('Scheduling.PrepareMaterials.Status2');
        default:
            return "";
    }
};
const getStatusTagType1 = (status: number) => {
    switch (status) {
        case 0:
            return "info";
        case 1:
            return "warning";
        default:
            return "";
    }
};
const getStatusText1 = (status: number) => {
    switch (status) {
        case 0:
            return t('Scheduling.PrepareMaterials.StatusType1');
        case 1:
            return t('Scheduling.PrepareMaterials.StatusType2');
        default:
            return "";
    }
};

// 获取备料单明细
const fetchDetail = (row: any) => {
    QueryMaterialPreparationDetail({ MaterialPreparationNo: row.MaterialPreparationNo }).then((res: any) => {
        if (res.Success) {
            tableData2.value = res.Data || [];
        }
    });
};

// 生成叫料单
const handleGenerateCall = () => {
    const selected = selectList.value[0];
    if (!selected) return;
    const isKitted = selected.IsKitted === 1;
    ElMessageBox.prompt(
        t('Scheduling.PrepareMaterials.inputReason'),
        t('Scheduling.PrepareMaterials.generateCall'),
        {
            confirmButtonText: t('publicText.confirm'),
            cancelButtonText: t('publicText.cancel'),
            inputType: 'textarea',
            inputPlaceholder: t('Scheduling.PrepareMaterials.inputReasonPlaceholder'),
            inputValidator: (value: string) => {
                if (!isKitted && !value.trim()) {
                    return t('Scheduling.PrepareMaterials.reasonRequired');
                }
                return true;
            }
        }
    ).then(({ value }: { value: string }) => {
        const params = {
            MaterialPreparationNo: selected.MaterialPreparationNo,
            CreateUser: userStore.getUserInfo,
            Reason: value.trim(),
        };
        GenerateMaterialRequest(params).then((res: any) => {
            ElNotification({
                title: t('publicText.tipTitle'),
                message: res.Message,
                type: res.Success ? "success" : "error",
            });
            if (res.Success) getData();
        });
    }).catch(() => {
        ElMessage.info(t('publicText.operationCancelled'));
    });
};

// 重新发送备料
const handleResend = (row: any) => {
    if (!row) return;
    ManualCreateSaiYiPreparePlan({ MaterialPreparationNo: row.MaterialPreparationNo }).then((res: any) => {
        if (res.Success) {
            ElNotification({
                title: t('publicText.tip'),
                message: res.Message || t('publicText.operationSuccess'),
                type: "success",
            });
            getData();
        } else {

            // ElMessage.error(res.Message || t('publicText.operationFailed'))
            ElMessageBox.alert(res.Message || t('publicText.operationFailed'), t('publicText.tipTitle'), {
                confirmButtonText: t('publicText.confirm'),
                type: 'error',
            })
        }
    });
};

const addMaterial = () => {
    const selected = selectList.value[0]
    if (!selected) return
    addForm.value.WOGroup = selected.WOGroup || ""
    addForm.value.Reason = ""
    addForm.value.MaterialList = [
        {
            MaterialPN: "",
            Qty: "",
            LineKey: ''

        }
    ]
    currentMaterialList.value = []
    if (selected.MaterialPreparationNo) {
        QueryMaterialPreparationDetail({ MaterialPreparationNo: selected.MaterialPreparationNo }).then((res: any) => {
            if (res.Success && res.Data) {
                currentMaterialList.value = res.Data
            }
        })
    }
    addVisible.value = true
}

const handleAddDialogClosed = () => {
    addForm.value.WOGroup = ""
    addForm.value.Reason = ""
    addForm.value.MaterialList = [
        {
            MaterialPN: "",
            Qty: "",
            LineKey: ''
        }
    ]
    currentMaterialList.value = []
    addFormRef.value?.resetFields()
}

const addMaterialRow = () => {
    addForm.value.MaterialList.push({
        MaterialPN: "",
        Qty: "",
        LineKey: ''
    })
}

const removeMaterialRow = (index: number) => {
    addForm.value.MaterialList.splice(index, 1)
    if (addForm.value.MaterialList.length === 0) {
        addForm.value.MaterialList.push({
            MaterialPN: "",
            Qty: "",
            LineKey: ''
        })
    }
}

const submitAddForm = () => {
    if (!addForm.value.WOGroup) {
        ElMessage.warning(t('message.pleaseInput') + t('Scheduling.PrepareMaterials.WOGroup'))
        return
    }
    const validList = addForm.value.MaterialList.filter((item: any) => item.MaterialPN && item.Qty)
    if (validList.length === 0) {
        ElMessage.warning(t('Scheduling.PrepareMaterials.materialListRequired'))
        return
    }
    submitLoading.value = true
    const params = {
        WOGroup: addForm.value.WOGroup,
        Reason: addForm.value.Reason,
        CreateUser: userStore.getUserInfo,
        MaterialList: validList
    }
    AddSupplementMaterialPreparation(params).then((res: any) => {
        ElNotification({
            title: t('publicText.tip'),
            message: res.Message,
            type: res.Success ? "success" : "error",
        });
        if (res.Success) {
            addVisible.value = false
            getData()
        }
    }).finally(() => {
        submitLoading.value = false
    })
}

// ---------- 选择与分页事件 ----------
const handleSelectionChange = (val: any[]) => {
    selectList.value = val;
};

const handleReset = () => {
    getForm.value.PageIndex = 1;
    getForm.value.WOGroup = "";
    getForm.value.Line = "";
    getForm.value.Status = "";
    getForm.value.IsKitted = "";
    getForm.value.KittingStatus = "";
    getData();
};

const handleSizeChange = (val: number) => {
    getForm.value.PageSize = val;
    getData();
};
const handleCurrentChange = (val: number) => {
    getForm.value.PageIndex = val;
    getData();
};
const handleSizeChange1 = (val: any) => {
    pageObj.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
    pageObj.currentPage = val;
};

// ---------- 列宽自动计算 ----------
const { getColumnWidth: getColumnWidth1 } = useTableColumnWidth(tableMasterRef, tableData, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')],
    excludeTypes: ['selection']
});

const { getColumnWidth: getColumnWidth2 } = useTableColumnWidth(tableDetailRef, tableData2, {
    excludeLabels: [t('publicText.index'), t('publicText.operation')]
});
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 500;
        tableHeight2.value = window.innerHeight - tableHeight.value - 215;
    });
};

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getLineList();
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

.error-content {
    .error-summary {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        background: rgba(244, 67, 54, 0.1);
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 1.1rem;
        color: #f44336;

        .summary-icon {
            font-size: 1.5rem;
        }

        strong {
            color: #f44336;
            font-size: 1.3rem;
        }
    }

    .error-item {
        display: flex;
        gap: 16px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-bottom: 12px;
        border-left: 4px solid #f44336;

        &:last-child {
            margin-bottom: 0;
        }

        .error-index {
            width: 32px;
            height: 32px;
            background: #f44336;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }

        .error-info {
            flex: 1;

            .error-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;

                .device-name {
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #2c3e50;
                }
            }

            .error-details {
                display: flex;
                gap: 20px;
                margin-bottom: 10px;

                .detail-item {
                    font-size: 0.95rem;
                    color: #596263;
                    background: white;
                    padding: 4px 10px;
                    border-radius: 4px;
                }
            }

            .error-message {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                font-size: 1rem;
                color: #f44336;
                line-height: 1.5;

                .el-icon {
                    margin-top: 2px;
                    flex-shrink: 0;
                }
            }
        }
    }
}

::deep(.error-dialog) {
    .el-dialog__header {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        border-bottom: 2px solid #fecaca;

        .el-dialog__title {
            color: #b91c1c;
            font-weight: 600;
            font-size: 1.1rem;
        }
    }

    .el-dialog__body {
        padding: 24px;
    }

    .el-dialog__footer {
        padding: 16px 24px;
        background: #fafafa;
        border-top: 1px solid #e5e7eb;
    }
}
</style>