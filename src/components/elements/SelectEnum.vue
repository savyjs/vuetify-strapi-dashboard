<template>
  <v-autocomplete
    v-model="data"
    :filled="!outlined"
    dense
    :multiple="_.get(field,'multi',_.get(field,'multiple',false))"
    :outlined="outlined"
    :label="label"
    :items="selectItems"
  />
</template>
<script>
  import _ from 'lodash'

  export default {
    props: ['value', 'type', 'outlined', 'field', 'label'],
    data() {
      return {
        data: this.value
      }
    },
    mounted() {
      this.loadData();
    },
    created() {
      this._ = _;
    },
    methods: {
      loadData() {
      }
    },
    computed: {
      selectItems() {
        return _.get(this.field, 'meta', [])
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
          this.$emit('change', val);
          this.$emit('input', val);
        },
        deep: true
      }
    }
  }
</script>
