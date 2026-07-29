<template>
    <div class="traceability">
        <el-card class="box-card" :body-style="{ padding: '8px' }">
            <div class="header">
                <div>
                    <el-form ref="formRef" class="form" :inline="true" size="small">
                        <el-form-item :label="t('assemble.traceability.station')">
                            <el-select size="small" v-model="getText.SearchModel.StationCode" clearable style="width: 220px">
                                <el-option v-for="item in codeList" :key="item.StationCode" :label="item.StationName"
                                    :value="item.StationCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="t('assemble.traceability.sn')">
                            <el-input size="small" :placeholder="t('publicText.pleaseInput')" clearable style="width: 220px"
                                v-model="getText.SearchModel.SN" class="input-with-select">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="t('assemble.traceability.preSn')">
                            <el-input size="small" :placeholder="t('publicText.pleaseInput')" clearable style="width: 220px"
                                v-model="getText.SearchModel.PreSN" class="input-with-select">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="t('assemble.traceability.time')">
                            <el-date-picker size="small" v-model="date" type="datetimerange" :range-separator="t('publicText.to')"
                                :start-placeholder="t('publicText.startDate')" style="width: 350px"
                                :end-placeholder="t('publicText.endDate')" value-format="YYYY-MM-DD HH:mm:ss"
                                :shortcuts="shortcuts" :default-time="defaultTime" :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSearch()">{{ t('publicText.query') }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="table_container">
                <el-table ref="tableRef" :data="tableData" :height="tableHeight" border size="small" stripe
                    highlight-current-row @row-click="handle" style="width: 100%">
                    <el-table-column prop="StationCode" :label="t('assemble.traceability.stationCode')"
                        :min-width="getColumnWidth('StationCode')"> </el-table-column>
                    <el-table-column prop="StationName" :label="t('assemble.traceability.stationName')"
                        :min-width="getColumnWidth('StationName')"> </el-table-column>
                    <el-table-column prop="SN" :label="t('assemble.traceability.snOrPreSn')"
                        :min-width="getColumnWidth('SN')"> </el-table-column>
                    <el-table-column prop="MoveType" :label="t('assemble.traceability.type')" width="80">
                        <template #default="scope">
                            {{ scope.row.MoveType == "movein" ? t('assemble.traceability.moveIn') :
                                t('assemble.traceability.moveOut') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="WorkOrder" :label="t('assemble.traceability.workOrder')"
                        :min-width="getColumnWidth('WorkOrder')"> </el-table-column>
                    <el-table-column prop="Result" :label="t('assemble.traceability.result')" width="80">
                    </el-table-column>
                    <el-table-column prop="OperateUser" :label="t('assemble.traceability.operator')"
                        :min-width="getColumnWidth('OperateUser')"> </el-table-column>
                    <el-table-column prop="OperateTime" :label="t('assemble.traceability.operateTime')"
                        :min-width="getColumnWidth('OperateTime')"> </el-table-column>
                </el-table>
                <div class="block" style="margin-top: 8px">
                    <el-pagination background size="small" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" :page-sizes="[5, 10, 20, 50, 100]"
                        :current-page="getText.PageIndex" :page-size="getText.PageSize"
                        layout="total,sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </div>
            <div class="box">
                <el-tabs v-model="activeName" style="width: 100%">
                    <el-tab-pane :label="t('assemble.traceability.componentBindList')" name="first">
                        <el-table :data="tableFirst" :height="tableHeight1" border stripe size="small">
                            <el-table-column prop="Code" :label="t('assemble.traceability.componentCode')" width="690">
                            </el-table-column>
                        </el-table></el-tab-pane>
                    <el-tab-pane :label="t('assemble.traceability.dataCollectionList')" name="second">
                        <el-table :data="tableSecond" :height="tableHeight1" border stripe size="small"
                            style="width: 100%">
                            <el-table-column prop="Name" :label="t('assemble.traceability.name')" width="230">
                            </el-table-column>
                            <el-table-column prop="Value" :label="t('assemble.traceability.value')" width="230">
                            </el-table-column>
                            <el-table-column prop="Unit" :label="t('assemble.traceability.unit')" width="230">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane :label="t('assemble.traceability.ngCodeList')" name="third">
                        <el-table :data="tableThird" :height="tableHeight1" border stripe size="small"
                            style="width: 100%">
                            <el-table-column prop="Code" :label="t('assemble.traceability.ngCode')" width="230">
                            </el-table-column>
                            <el-table-column prop="Name" :label="t('assemble.traceability.ngName')" width="230">
                            </el-table-column>
                            <el-table-column prop="Remark" :label="t('assemble.traceability.remark')" width="460">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    GetAssSpecMoveHistory,
    GetAssSpecDataList,
    GetAssSpecMaterialBind,
    GetAssSpecNGList,
    GetAssSpec,
} from "@/api/assemble/traceability";
import { useTableColumnWidth } from "@/hooks/useTableColumnWidth";
import { useI18n } from "vue-i18n";
import { ElMessage, ElLoading } from "element-plus";
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";

const { t } = useI18n();

const formRef = ref();
const tableRef = ref();

const getText = reactive({
    PageIndex: 1,
    PageSize: 50,
    SearchText: "",
    SearchModel: {
        SN: "",
        PreSN: "",
        WorkOrder: "",
        StationCode: "",
        DeviceCode: "",
        OperateStartTime: "",
        OperateEndTime: "",
        OperateUser: "",
    },
    StartTime: "",
    EndTime: "",
});

const date = ref<[string, string] | null>(null);
const tableData = ref<any[]>([]);
const activeName = ref("first");
const total = ref(0);
const tableHeight = ref(0);
const tableHeight1 = ref(0);
const innerHeight = ref(window.innerHeight);
const tableFirst = ref<any[]>([]);
const tableSecond = ref<any[]>([]);
const tableThird = ref<any[]>([]);
const MoveHistoryID = ref("");
const codeList = ref<any[]>([]);
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)] as [Date, Date];
let loadingInstance: any = null;

const { getColumnWidth } = useTableColumnWidth(tableRef, tableData, {
    excludeLabels: [t("publicText.operation")],
});

watch(date, (newdata) => {
    if (newdata != null) {
        getText.SearchModel.OperateStartTime = newdata[0];
        getText.SearchModel.OperateEndTime = newdata[1];
    } else {
        getText.SearchModel.OperateStartTime = "";
        getText.SearchModel.OperateEndTime = "";
    }
});

watch(activeName, (value) => {
    if (MoveHistoryID.value !== "") {
        getHistory(value);
    }
});

const startLoading = () => {
    loadingInstance = ElLoading.service({
        lock: true,
        text: t("message.loading"),
        background: "rgba(0, 0, 0, 0.2)",
    });
};

const endLoading = () => {
    loadingInstance?.close();
};

const getCodeList = () => {
    GetAssSpec().then((res: any) => {
        if (res.Success) {
            codeList.value = res.Data;
        } else {
            ElMessage.error(res.Msg);
        }
    });
};

const getData = () => {
    GetAssSpecMoveHistory(getText).then((res: any) => {
        if (res.Success) {
            let data = res.Data;
            total.value = data.Total;
            tableData.value = data.list;
        } else {
            ElMessage.error(res.Msg);
        }
    });
};

const handleSizeChange = (value: number) => {
    getText.PageSize = value;
    getData();
};

const handleCurrentChange = (value: number) => {
    getText.PageIndex = value;
    getData();
};

const getHistory = (value: string) => {
    startLoading();
    if (value == "first") {
        GetAssSpecMaterialBind({ MoveHistoryID: MoveHistoryID.value }).then((res: any) => {
            if (res.Success) {
                tableFirst.value = res.Data;
            } else {
                ElMessage.error(res.Msg);
            }
            endLoading();
        });
    } else if (value == "second") {
        GetAssSpecDataList({ MoveHistoryID: MoveHistoryID.value }).then((res: any) => {
            if (res.Success) {
                tableSecond.value = res.Data;
            } else {
                ElMessage.error(res.Msg);
            }
            endLoading();
        });
    } else if (value == "third") {
        GetAssSpecNGList({ MoveHistoryID: MoveHistoryID.value }).then((res: any) => {
            if (res.Success) {
                tableThird.value = res.Data;
            } else {
                ElMessage.error(res.Msg);
            }
            endLoading();
        });
    }
};

const handle = (row: any) => {
    MoveHistoryID.value = row.MoveHistoryID;
    getHistory(activeName.value);
};

const handleSearch = () => {
    getText.PageIndex = 1;
    tableFirst.value = [];
    tableSecond.value = [];
    tableThird.value = [];
    getData();
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = (window.innerHeight - 245) * 0.6;
        tableHeight1.value = (window.innerHeight - 245) * 0.4;
    });
};

const onResize = () => {
    innerHeight.value = window.innerHeight;
    getScreenHeight();
};

onMounted(() => {
    getCodeList();
    date.value = [setLastDate() as string, setTodayDate() as string];
    getScreenHeight();
    window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
});
</script>

<style lang="scss" scoped>
.traceability {
    padding: 8px;

    .header {
        padding-bottom: 10px;
        display: flex;
        align-items: center;

        .input_box {
            width: 400px;
        }
    }

    .table_container {
        margin-bottom: 8px;
    }

    .box {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
    }
}

.el-form-item {
    margin-bottom: 0;
}
</style>
