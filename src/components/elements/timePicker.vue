<template>
  <v-menu
    ref="menu"
    v-model="fromDateModel"
    :close-on-content-click="false"
    :return-value.sync="data"
    transition="scale-transition"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :prepend-inner-icon="innerIcon!==false ? 'event': undefined"
        :prepend-icon="innerIcon==false ? 'event': undefined"
        :label="label"
        :filled="!!filled"
        :outlined="outlined!==undefined"
        dense
        color="primary"
        v-model="data"
        clearable
        class="mx-1"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      :use-seconds="useSeconds"
      :landscape="$vuetify.breakpoint.smAndUp"
      @click:minute="$refs.menu.save(data)"
      format="24hr"
      color="primary"
      v-model="data"
      :label="$t('clock')">
      <v-spacer></v-spacer>
      <v-btn text color="secondary" @click="fromDateModel = false">
        {{$t('close')}}
      </v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(data)">
        {{$t('save')}}
      </v-btn>
    </v-time-picker>
  </v-menu>
</template>

<i18n>
  {
  "en":{
  "date":"select date",
  "close":"close",
  "save":"save",
  "clock":"select clock"
  },
  "fa":{
  "date":"انتخاب روز",
  "close":"بستن",
  "save":"ذخیره",
  "clock":"انتخاب ساعت"
  }
  }
</i18n>
<script>
  import _ from "lodash";

  export default {
    props: ['value', 'outlined', 'filled', 'useSeconds', 'label', 'innerIcon', 'type', 'field'],
    data() {
      return {
        fromDateModel: null,
        fromDateMenu: null,
        data: null
      }
    },
    methods: {
      chargeData() {
        this.data = this.value ? this.value.replace('.000','') : '00:00:00';
      }
    },
    mounted() {
      this.chargeData();
    },
    created() {
      this._ = _;
    },
    computed: {},
    watch: {
      data(val) {
        try {
          return this.$emit('input', val)
        } catch (e) {
          console.error({e})
        }
      },
      value(val) {
        this.chargeData();
      }
    }
  }
</script>
