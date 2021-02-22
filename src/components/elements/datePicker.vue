<template>
  <v-menu
    ref="fromDateMenu"
    v-model="fromDateModel"
    :close-on-content-click="false"
    :return-value.sync="data"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :prepend-inner-icon="innerIcon!==false ? 'event': undefined"
        :prepend-icon="innerIcon==false ? 'event': undefined"
        :label="label"
        :filled="!!filled"
        :outlined="outlined!==undefined"
        dense
        readonly
        color="primary"
        :value="jdata"
        class="mx-1"
        v-on="on"
        clearable
      ></v-text-field>
    </template>
    <v-date-picker
      :show-current="true"
      color="primary"
      first-day-of-week="6"
      reactive
      :locale="getLocale"
      v-model="data"
      @change="$refs.fromDateMenu.save(data)"
      scrollable
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="makeItToday">{{$t("today")}}</v-btn>
      <v-btn v-if="false" text color="primary" @click="fromDateModel = false">{{$t("cancel")}}</v-btn>
      <v-btn v-if="false" text color="primary" @click="$refs.fromDateMenu.save(data)">
        {{$t('ok')}}
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<i18n>
  {
  "en":{
  "cancel":"Cancel",
  "ok":"Ok",
  "today":"today",
  "date":"select date",
  "clock":"select clock"
  },
  "fa":{
  "cancel":"کنسل",
  "ok":"تایید",
  "today":"امروز",
  "date":"انتخاب روز",
  "clock":"انتخاب ساعت"
  }
  }
</i18n>
<script>
  export default {
    props: ['value', 'locale', 'outlined', 'filled', 'label', 'innerIcon', 'type', 'field'],
    data() {
      return {
        fromDateModel: null,
        fromDateMenu: null,
        data: ''
      }
    },
    mounted() {
      this.chargeDate()
    },
    computed: {
      getLocale() {
        return _.get(this, 'vsd.locale', undefined);
      },
      jdata() {
        try {
          let d = new Date(this.data);
          return d && isFinite(d) && this.data ? (_.get(this.vsd, 'locale', undefined) !== "fa-ir" ? this.data : this.$Helper.toJalaali(this.data, 'jYYYY/jM/jD')) : '';
        } catch (e) {
          console.error({e})
        }
      }
    },
    methods: {
      makeItToday() {
        let today = new Date().toISOString();
        this.chargeDate(today);
      },
      chargeDate(val = undefined) {
        try {
          let value = val || this.value;
          const event = new Date(value);
          this.data = isFinite(event) ? value : '';
        } catch (e) {
          console.error({e})
        }
      }
    },
    watch: {
      data(val) {
        try {
          let value = val ? this.$Helper.getDate(val) : '';
          return this.$emit('input', value)
        } catch (e) {
          console.error({e})
        }
      },
      value(val) {
        let value = val ? this.$Helper.getDate(val) : '';
        this.chargeDate();
      }
    }
  }
</script>
