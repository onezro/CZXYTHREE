<template>
    <div class="inboundInspec">
        <el-row>
            <el-col :span="16">
                <el-card shadow="always" :body-style="{ padding: '8px' }">
                    <div class="left-box">
                        <el-form class="inbound" label-position="left" :model="form" ref="formRef" :rules="rules"
                            label-width="150px" size="default" @submit.native.prevent>
                            <el-form-item :label="t('finishProduct.inboundInspec.workOrder')">
                                <el-select v-model="form.Wo" @change="change" filterable
                                    :placeholder="t('finishProduct.inboundInspec.clickToSelect')">
                                    <el-option style="font-size: 30px" v-for="item in workOrderList" :key="item.WO"
                                        :label="item.WO" :value="item.WO"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.inboundInspec.productCode')">
                                <span style="font-size: 30px; font-weight: bolder">
                                    {{ form.Pn }}
                                </span>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.inboundInspec.productName')">
                                <span style="font-size: 30px; font-weight: bolder">
                                    {{ form.Name }}
                                </span>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.inboundInspec.productSpec')">
                                <span style="font-size: 30px; font-weight: bolder">
                                    {{ form.Spec }}
                                </span>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.inboundInspec.resource')">
                                <el-select v-model="toForm.Equipment"
                                    :placeholder="t('finishProduct.inboundInspec.selectResource')">
                                    <el-option v-for="item in equipmentChoice" :key="item.value" :label="item.lable"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.inboundInspec.serialCode')" prop="PcbSn">
                                <el-input ref="inputRef" v-model="form.PcbSn" @keyup.enter="changeFocus"></el-input>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.inboundInspec.finishCode')">
                                <el-input ref="finishedProductRef" v-model="stringcode"
                                    @keyup.enter="onSubmit"></el-input>
                            </el-form-item>
                            <el-form-item :label="t('finishProduct.inboundInspec.inspectionResult')">
                                <el-select v-model="form.Result" filterable
                                    :placeholder="t('finishProduct.inboundInspec.clickToSelect')">
                                    <el-option style="font-size: 30px" v-for="item in options" :key="item.value"
                                        :label="item.lable" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-button ref="myButton" type="primary" :style="{ display: 'none' }" @click="onSubmit">
                        {{ t('publicText.save') }}
                    </el-button>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-table :data="tableData" border :height="tableHeight" stripe>
                    <el-table-column prop="OperationName" :label="t('finishProduct.inboundInspec.processName')">
                    </el-table-column>
                    <el-table-column prop="EquipmentID"
                        :label="t('finishProduct.inboundInspec.equipmentId')"></el-table-column>
                    <el-table-column prop="StatusCODE" :label="t('finishProduct.inboundInspec.result')">
                        <template #default="scope">
                            <el-tag :type="scope.row.StatusCODE == 'PASS' || scope.row.StatusCODE == 'OK'
                                ? 'success'
                                : 'danger'" effect="dark">
                                {{ scope.row.StatusCODE }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="DateTime" :label="t('finishProduct.inboundInspec.time')"> </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-dialog :class="form.Result == 'PASS' ? 'pass' : 'fail'" v-model="dialogVisible" width="30%">
            <span>{{ form.Result }}</span>
        </el-dialog>

        <el-dialog v-for="key in dialogForm" :key="key.dialogVisible" :title="t('publicText.tip')"
            v-model="key.dialogVisible" width="50%">
            <span class="dio-msg">{{ key.Msg }}</span>
            <template #footer>
                <el-button type="primary" @click="key.dialogVisible = false">{{ t('publicText.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { getFinshOrder, SaveIntactProduct, TransferData, getContainerMoves, getPCBMoves } from "@/api/finishProduct/inboundInspec";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, onBeforeMount, onUnmounted, nextTick, getCurrentInstance } from "vue";
import dayjs from "dayjs";
import failAudio from "@/assets/mp3/fail.mp3";

const { t } = useI18n();
const userStore = useUserStoreWithOut();

const formRef = ref();
const inputRef = ref();
const finishedProductRef = ref();

const tableHeight = ref(0);
const dialogVisible = ref(false);
const workOrderList = ref<any[]>([]);
const isCoolingDown = ref(false);
let timerId: ReturnType<typeof setTimeout> | null = null;

const form = reactive({
    Wo: "",
    Pn: "",
    Spec: "",
    Name: "",
    PcbSn: "",
    Result: "PASS",
    Status: 0,
    CheckUser: userStore.getUserInfo || "",
    CheckTime: "",
});

const validatePcbSn = (rule: any, value: string, callback: any) => {
    if (value === "") {
        callback(new Error(t('finishProduct.inboundInspec.enterSerialCode')));
    } else if (!value.startsWith("40502") && !value.startsWith("IBZJ")) {
        callback(new Error(t('finishProduct.inboundInspec.mustStartWith')));
    } else {
        callback();
    }
};

const rules = {
    PcbSn: [{ validator: validatePcbSn, trigger: "blur" }],
};

const stringcode = ref("");
const options = [
    { lable: "PASS", value: "PASS" },
    { lable: "FAIL", value: "FAIL" },
];

const tableData = ref<any[]>([]);

const toForm = reactive({
    ContainerName: "",
    Equipment: "OQC",
    DataHeaderID: "709e558f16bf5365c6f343d20c84360d",
    TestResult: "ok",
    finishCode: "",
    OrderName: "",
});

const equipmentChoice = [
    { value: "OQC", lable: "OQC" },
];

const dialogForm = reactive({
    upDate: { dialogVisible: false, Msg: "" },
    dip: { dialogVisible: false, Msg: "" },
    smt: { dialogVisible: false, Msg: "" },
    product: { dialogVisible: false, Msg: "" },
});

const failAudioEl = new Audio(failAudio);

const failPlay = () => {
    failAudioEl.play().catch(() => { });
};

const getData = () => {
    getFinshOrder({}).then((res: any) => {
        workOrderList.value = JSON.parse(res.Data);
    });
};

const change = (order: string) => {
    const product = workOrderList.value.find((item: any) => item.WO == order);
    if (product) {
        form.Pn = product.PdModel;
        form.Name = product.PdModelName;
        form.Spec = product.PdModelSpec;
    }
    nextTick(() => {
        inputRef.value?.focus();
    });
};

const onSubmit = () => {
    if (isCoolingDown.value) {
        ElMessage.warning(t('finishProduct.inboundInspec.noRepeatClick'));
        return;
    }
    if (
        stringcode.value.toLowerCase().startsWith("40510") &&
        stringcode.value.toLowerCase().substring(0, 13) !== form.Pn
    ) {
        ElMessage.error(t('finishProduct.inboundInspec.mismatch'));
        return;
    }
    isCoolingDown.value = true;
    timerId = setTimeout(() => {
        isCoolingDown.value = false;
    }, 2000);

    form.CheckUser = userStore.getUserInfo || "";
    form.CheckTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    toForm.ContainerName = form.PcbSn;
    toForm.TestResult = form.Result == "PASS" ? "OK" : "NG";
    toForm.DataHeaderID = generateGuid();
    toForm.OrderName = form.Wo;
    
    SaveIntactProduct(form, stringcode.value).then((res: any) => {
        if (res.Code == 200) {
            ElMessage.success(t('finishProduct.inboundInspec.saveSuccess'));
            const saveContainerName = res.Data;
            getPCBMoves(saveContainerName).then((res: any) => {
                if (res.Success) {
                    tableData.value = res.Data.map((item: any) => {
                        return {
                            ...item,
                            DateTime: formatDate(item.DateTime),
                        };
                    });
                    tableData.value.sort((a: any, b: any) => {
                        const aTime: any = new Date(a.DateTime);
                        const bTime: any = new Date(b.DateTime);
                        return bTime - aTime;
                    });
                    form.Result = "PASS";
                    form.PcbSn = "";
                    stringcode.value = "";
                    nextTick(() => {
                        inputRef.value?.focus();
                    });
                }
            });

            getContainerMoves(saveContainerName).then((res: any) => {
                if (res.Success) {
                    tableData.value = [...tableData.value, ...res.Data];
                }
            });

            TransferData({ ...toForm, ContainerName: saveContainerName }).then((Transferes: any) => {
                const res = JSON.parse(JSON.parse(Transferes.Data));
                if (res.IsSucess == true) {
                    dialogVisible.value = true;
                    setTimeout(() => {
                        dialogVisible.value = false;
                    }, 1000);
                    stringcode.value = "";
                    inputRef.value?.select();
                } else {
                    failPlay();
                    dialogForm.upDate.dialogVisible = true;
                    dialogForm.upDate.Msg = t('finishProduct.inboundInspec.processCheckFail');
                }
            });
        } else {
            dialogForm.product.dialogVisible = true;
            dialogForm.product.Msg = res.Msg;
            failPlay();
        }
    }).catch((err: any) => {
        dialogForm.product.dialogVisible = true;
        dialogForm.product.Msg = err;
        failPlay();
    });
};

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 32) {
        event.preventDefault();
        const button = document.querySelector('button[ref="myButton"]') as HTMLButtonElement;
        button?.click();
    }
};

const generateGuid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
};

const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 100;
    });
};

const changeFocus = () => {
    if (!form.PcbSn.toLowerCase().startsWith("40502") && !form.PcbSn.startsWith("IBZJ")) {
        ElMessage.error(t('finishProduct.inboundInspec.pcbaError'));
        return;
    }
    finishedProductRef.value?.focus();
};

onBeforeMount(() => {
    getScreenHeight();
});

onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    document.addEventListener("keydown", handleKeyDown);
    getData();
});

onUnmounted(() => {
    window.removeEventListener("resize", getScreenHeight);
    document.removeEventListener("keydown", handleKeyDown);
    if (timerId) {
        clearTimeout(timerId);
    }
});
</script>

<style lang="scss">
.left-box {
    box-sizing: border-box;
    width: 100%;
    height: calc(100vh - 100px);
}
.inbound .el-select__input {
    font-size: 30px;
    font-weight: bolder;
}
.inbound .el-select__placeholder,
.inbound .el-select__selected-item {
    font-size: 30px;
    font-weight: bolder;
}
.inbound .el-form-item__label {
    font-size: 20px;
}

.inbound .el-input__inner {
    font-size: 30px;
    font-weight: bolder;
}

.pass .el-dialog__body {
    padding: 0px;
    color: #fff;
    background: green;
    font-size: 150px;
    text-align: center;
}

.pass .el-dialog__header {
    padding: 0px;
}

.fail .el-dialog__body {
    padding: 0px;
    color: #fff;
    background: red;
    font-size: 150px;
    text-align: center;
}

.fail .el-dialog__header {
    padding: 0px;
}

.pass .el-dialog,
.fail .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.pass .el-dialog .el-dialog__body,
.fail .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
}

.dio-msg {
    font-size: 30px;
    color: red;
}
</style>