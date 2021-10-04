<template>
  <v-text-field  persistent-hint :hint="hint"  filled type="number" :label="label" v-model="data"/>
</template>
<script>
  export default {
    props: ['value', 'main', 'hint', 'type', 'field', 'label'],
    data() {
      return {
        data: this.value,
      }
    },
    mounted() {
      this.data = this.getVal;
    },
    watch: {
      data(val) {
        this.$emit('input', val)
      },
      getVal(val) {
        this.data = val;
      },
      main: {
        handler(val) {
          this.data = this.getVal;
        },
        deep: true
      }
    },
    computed: {
      getVal() {
        let pathes = _.get(this.field, 'meta', []);
        let total = 0;
        _.forEach(pathes, (path) => {
          let item = _.get(this.main, path, 0);
          if (_.isArray(item)) {
            let val = parseFloat(_.get(item, path, 0));
            console.log('path , item', 'val', {path, item, val})
            total = total + val;
          } else {
            let val = parseFloat(item);
            total = total + val;
          }
        })
        return total;
      }
    }
  }
</script>
