<template>
  <v-row>
    <v-col v-if="!outlined" cols="12">
      <label>{{label}}</label>
    </v-col>
    <v-col sm="6">
      <date-picker :locale="locale" :outlined="outlined" :filled="filled" v-model="date" :label="$t('date')"/>
    </v-col>
    <v-col sm="6">
      <time-picker :use-seconds="useSeconds" v-show="date" :locale="locale" :outlined="outlined" :filled="filled"
                   v-model="time"
                   :label="$t('clock')"/>
    </v-col>
  </v-row>
</template>
<i18n>
  {
  "en":{
  "date":"select date",
  "clock":"select clock"
  },
  "fa":{
  "date":"انتخاب روز",
  "clock":"انتخاب ساعت"
  }
  }
</i18n>
<script>

  export default {
    props: ['value', 'label', 'locale', 'useSeconds', 'outlined', 'filled'],
    data() {
      return {
        date: null,
        time: null
      }
    },
    computed: {
      datetime() {
        if (this.date && this.time) {
          return this.$Helper.combineDateTime(this.date, this.time);
        } else if (this.date) {
          return this.date;
        } else if (this.time) {
          return this.time;
        }
      }
    },
    mounted() {
      this.chargeDateTime();
    },
    methods: {
      chargeDateTime() {
        let val = this.value;
        if (!val) return;
        let time = this.$Helper.getTime(val);
        this.time = time;
        this.date = val;
      }
    },
    watch: {
      value(val) {
        this.chargeDateTime()
      },
      datetime(val) {
        return this.$emit('input', val)
      }
    }
  }
</script>
