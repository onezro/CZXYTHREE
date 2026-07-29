<template>
  <div class="auxiliary">
    <el-card class="box-card">
      <template #header>
        <el-form
          :model="form"
          ref="formRef"
          class="form"
          label-width="80px"
          :inline="false"
          size="default"
        >
          <el-form-item :label="t('smtset.auxiliary.product')">
            <el-select
              v-model="form.product"
              @change="change"
              clearable
              filterable
              :placeholder="t('smtset.auxiliary.selectPlaceholder')"
            >
              <el-option
                v-for="item in productArr"
                :key="item.Product"
                :label="item.Product"
                :value="item.Product"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="6" :offset="0">
              <el-form-item :label="t('smtset.auxiliary.width')">
                <el-input v-model="form.width" :placeholder="t('smtset.auxiliary.widthPlaceholder')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item :label="t('smtset.auxiliary.speed')">
                <el-input v-model="form.speed" :placeholder="t('smtset.auxiliary.speedPlaceholder')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16" :offset="0">
              <el-form-item class="btn">
                <el-button type="primary" @click="onSubmit">{{ t('smtset.auxiliary.submit') }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <div class="box" v-if="showBox">
        <div>{{ t('smtset.auxiliary.setResult') }}：{{ setData.product }}</div>
        <div>{{ t('smtset.auxiliary.setWidth') }}：{{ setData.width }} cm</div>
        <div>{{ t('smtset.auxiliary.setSpeed') }}：{{ setData.speed }} s</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getProduct, getProductDetail, insetProductData } from "@/api/smtSet/auxiliary";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { ref, reactive } from "vue";

const { t } = useI18n();

const formRef = ref();
const form = reactive({
  product: "",
  width: "",
  speed: "",
  updatetime: "",
});
const productArr = ref<any[]>([]);
const showBox = ref(false);
const setData = reactive({
  product: "",
  width: "",
  speed: "",
});

const getData = () => {
  getProduct({
    product: "string",
  }).then((res:any) => {
    if(res.Status=='OK'){
      productArr.value = res.Products || [];
    }
  });
};

const onSubmit = () => {
  form.updatetime = new Date().toJSON();
  showBox.value = true;

  insetProductData(form).then((res:any) => {
    if (res.Status == "OK") {
      setData.product = form.product;
      setData.width = form.width;
      setData.speed = form.speed;
      ElMessage.success(t("smtset.auxiliary.setSuccess"));
    } else {
      ElMessage.error(res.Message);
    }
  });
};

const change = (name: string) => {
  form.width = "";
  form.speed = "";
  getProductDetail({
    product: name,
  }).then((res:any) => {
    if(res.Status=='OK'){
        console.log(res);
      form.product = res.Product;
      form.width = res.Width;
      form.speed = res.Speed;
    }else{
        ElMessage.error(res.Message);
    }
  });
};

getData();
</script>

<style lang="scss" scoped></style>