<template>
  <div v-if="_.includes(['textarea','json'],type)">
    <v-textarea :label="label" dense outlined :prepend-icon="icon" v-model="data"/>
  </div>
  <div v-else-if="_.includes(['rich'],type)">
    <text-editor :label="label" dense outlined :prepend-icon="icon" v-model="data"/>
  </div>
  <div v-else-if="_.includes(['image'],type)">
    <select-photo :label="label" dense outlined :prepend-icon="icon" v-model="data"/>
  </div>
  <div v-else-if="_.includes(['bool'],type)">
    <v-checkbox v-model="data" dense outlined :prepend-icon="icon" :label="label"/>
  </div>
  <div v-else-if="_.includes(['price'],type)">
    <v-text-field
      v-model="data"
      :hint="$Helper.numberFormat(value) + ' ریال'"
      :label="label"
      dense
      ref="data"
      outline
    ></v-text-field>
  </div>
  <div v-else-if="_.includes(['number'],type)">
    <v-text-field
      persistent-hint
      :hint="$Helper.numberFormat(value)"
      :label="label"
      dense
      ref="data"
      outline
      v-model="data"
    />
  </div>
  <div v-else-if="_.includes(['dateTime'],type)">
    <date-time-picker v-model="data" :label="label"/>
  </div>
  <div v-else-if="_.includes(['date'],type)">
    <date-picker v-model="data" :label="label"/>
  </div>
  <div v-else-if="_.includes(['counter'],type)">
    <counter :outlined="true" v-model="data" :label="label" :icon="icon" :field="field"/>
  </div>
  <div v-else>
    <v-text-field v-model="data" outlined :prepend-icon="icon" dense :label="label"/>
  </div>
</template>
<script>
  import TextEditor from "~/components/admin/elements/TextEditor";
  import SelectPhoto from "~/components/admin/elements/SelectPhoto";
  import DateTimePicker from "~/components/admin/elements/dateTimePicker";
  import DatePicker from "~/components/admin/elements/FilterDatePicker";
  import Counter from "~/components/admin/elements/Counter";

  /**
   * @value: any - this property value
   * @type: String - this property type - image bool text rich ...
   * @item: Object - all properties of item
   * @field: Object - filed properties
   * */
  export default {
    components: {Counter, DatePicker, DateTimePicker, SelectPhoto, TextEditor},
    props: ['value', 'field'],
    data() {
      return {
        errorMessages: '',
        data: this.value
      }
    },
    computed: {
      type() {
        return _.get(this.field, 'type', undefined)
      },
      icon() {
        return _.get(this.field, 'icon', 'fa-pencil')
      },
      label() {
        return this.$t(_.get(this.field, 'text', ''))
      },
    },
    mounted() {
      if (_.includes(['number', 'counter'], this.type)) {
        this.data = parseInt(this.$Helper.faToEn(_.isNumber(this.value) ? this.value : (_.get(this.field, 'min', 0))));
      }
    },
    watch: {
      value: {
        handler(val) {
          this.data = val;
        },
        deep: true
      },
      data: {
        handler(val) {
          if (_.includes(['number', 'counter'], this.type)) {
            val = this.$Helper.faToEn(val);
          }
          return this.$emit('input', val);
        },
        deep: true
      }
    }
  }
</script>
