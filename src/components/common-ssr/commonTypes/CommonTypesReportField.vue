<template>
  <common-types-filter-field
    v-model="data"
    :hasLabel="false"
    :outlined="true"
    :filled="false"
    :field="field"
  />
</template>
<script>
  import CommonTypesFilterField from "./CommonTypesFilterField";

  /**
   * @value: any - this property value
   * @type: String - this property type - image bool text rich ...
   * @item: Object - all properties of item
   * @field: Object - filed properties
   * */
  export default {
    name: 'CommonTypesReportField',
    props: ['value', 'field'],
    data() {
      return {
        data: this.value
      }
    },
    computed: {},
    watch: {
      value: {
        handler(val) {
          this.data = val;
        },
        deep: true
      },
      data: {
        handler(val) {
          return this.$emit('input', val);
        },
        deep: true
      }
    }
  }
</script>
