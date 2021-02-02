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
        color="primary"
        :value="jdata"
        class="mx-1"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      :show-current="true"
      color="primary"
      first-day-of-week="6"
      reactive
      locale="fa-ir"
      v-model="data"
      @change="$refs.fromDateMenu.save(data)"
      scrollable
    >
      <v-spacer></v-spacer>
      <v-btn v-if="false" text color="primary" @click="fromDateModel = false">{{'لغو'}}
      </v-btn>
      <v-btn v-if="false" text color="primary" @click="$refs.fromDateMenu.save(data)">
        {{'تایید'}}
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
  export default {
    props: ['value', 'outlined', 'filled', 'label', 'innerIcon', 'type', 'field'],
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
      jdata() {
        try {
          let d = new Date(this.data);
          // console.log('jdata charge', this.data, {d})
          return d && isFinite(d) && this.data ? (this.$Helper.toJalaali(this.data, 'jYYYY/jM/jD')) : '';
        } catch (e) {
          console.error({e})
        }
      }
    },
    methods: {
      chargeDate() {
        try {
          const event = new Date(this.value);
          // console.log('data charge', this.value, {event})
          this.data = isFinite(event) ? this.value : '';
        } catch (e) {
          console.error({e})
        }
      }
    },
    watch: {
      data(val) {
        try {
          let value = val ? this.$Helper.getDate(val) : '';
          // console.log('data emit', {val, value})
          return this.$emit('input', value)
        } catch (e) {
          console.error({e})
        }
      },
      value(val) {
        let value = val ? this.$Helper.getDate(val) : '';
        // console.log('value watch', {val, value})
        this.chargeDate();
      }
    }
  }
</script>
