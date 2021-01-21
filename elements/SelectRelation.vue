<template>
  <v-autocomplete
    @click="reloadData"
    v-model="data"
    :filled="!outlined"
    :outlined="outlined"
    :multiple="_.get(field,'multi',false)"
    dense
    :label="label"
    :items="selectItems"
  />
</template>
<script>
  export default {
    props: ['value', 'type','outlined', 'field', 'label'],
    data() {
      return {
        data: this.value
      }
    },
    mounted() {
      this.loadData();
    },
    methods: {
      reloadData() {
        if (!_.isArray(this.selectItems)) {
          this.loadData()
        }
      },
      loadData() {
        if (_.has(this.field, 'store', undefined)) {
          let name = _.get(this.field, 'store', null);
          this.$store.dispatch(`commonSelect/${name}`, name);
        } else if (_.has(this.field, 'server', undefined)) {
          this.$store.dispatch(`commonSelect/server`, this.field);
        }
      }
    },
    computed: {
      selectItems() {
        if (_.has(this.field, 'store', undefined)) {
          let name = _.get(this.field, 'store', null);
          return _.get(this.$store.state.commonSelect, name, [])
        } else if (_.has(this.field, 'server', undefined)) {
          let name = _.get(this.field, 'value', null);
          return _.get(this.$store.state.commonSelect.server, name, [])
        }
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
