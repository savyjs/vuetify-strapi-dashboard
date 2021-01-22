<template>
  <v-autocomplete
    v-model="data"
    :filled="!outlined"
    dense
    :outlined="outlined"
    :label="label"
    :items="selectItems"
  />
</template>
<script>
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
