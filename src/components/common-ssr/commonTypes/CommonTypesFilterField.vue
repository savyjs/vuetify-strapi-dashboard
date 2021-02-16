<template>
  <div v-if="_.includes(['bool','boolEdit','image',],type)">
    <v-checkbox v-model="data" dense :outlined="outlined" :prepend-icon="icon" :label="label"/>
  </div>

  <div v-else-if="_.includes(['select'],type)">
    <common-select-relation v-model="data" :outlined="outlined" :type="type" :field="field" :label="undefined"/>
  </div>
  <div v-else-if="_.includes(['enum'],type)">
    <common-select-enum v-model="data" :outlined="outlined" :type="type" :field="field" :label="undefined"/>
  </div>

  <div v-else-if="_.includes(['price'],type)">
    <v-text-field
      v-model="data"
      :hint="$Helper.numberFormat(value) + $t('$')"
      :label="label"
      dense
      ref="data"
      :outline="outlined"
    ></v-text-field>
  </div>
  <div v-else-if="_.includes(['number'],type)">
    <v-text-field
      persistent-hint
      :hint="$Helper.numberFormat(value)"
      :label="label"
      dense
      ref="data"
      :outlined="outlined"
      v-model="data"
    />
  </div>
  <div v-else-if="_.includes(['dateTime','jDateTime'],type)">
    <date-time-picker :outlined="true" v-model="data" :label="label"/>
  </div>
  <div v-else-if="_.includes(['date','jdate'],type)">
    <date-picker :inner-icon="false" :outlined="outlined" :filled="false" v-model="data" :label="label"/>
  </div>
  <div v-else>
    <v-text-field v-model="data" :outlined="outlined" :filled="false" :prepend-icon="icon" dense
                  :label="hasLabel ? label : undefined"/>
  </div>
</template>

<i18n>
  {
  "en":{
  "$":"$"
  },
  "fa":{
  "$":"ریال"
  }
  }
</i18n>
<script>


  /**
   * @value: any - this property value
   * @type: String - this property type - image bool text rich ...
   * @item: Object - all properties of item
   * @field: Object - filed properties
   * */
  export default {
    name: 'CommonTypesFilterField',
    props: ['value', 'field', 'hasLabel', 'outlined'],
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
        return this.hasLabel !== false ? _.get(this.field, 'text', '') : null;
      }
    },
    methods: {
      emitter(val) {
        return this.$emit('input', (_.get(this.field, 'numeric', false) || this.type == 'number') ? parseInt(val) : val);
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
          this.emitter(val)
        },
        deep: true
      }
    }
  }
</script>
