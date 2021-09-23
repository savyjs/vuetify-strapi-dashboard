<template>
  <v-autocomplete
    @click="reloadData"
    v-model="data"
    :filled="!outlined"
    :outlined="outlined"
    :item-value="_.get(field,'meta.value','value')"
    :item-text="_.get(field,'meta.text','text')"
    :multiple="_.get(field,'multi',_.get(field,'multiple',false))"
    dense
    :label="label"
    :items="selectItems"
  >
    <template v-if="isServerOrStore" v-slot:append>
      <v-icon @click="reloadData">refresh</v-icon>
    </template>
  </v-autocomplete>
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
    reloadData() {
      if (!_.isArray(this.selectItems)) {
        this.loadData()
      }
    },
    loadData() {
      if (_.get(this.field, 'store', undefined)) {
        let name = _.get(this.field, 'store', null);
        let isCustomStore = (name.split('.').length > 1 || name.split('/').length > 1)
        try {
          isCustomStore ? this.$store.dispatch(`${name.replace('.', '/')}`, name) : this.$store.dispatch(`commonSelect/${name}`, name);
        } catch (e) {
          console.error({e})
        }
      } else if (_.get(this.field, 'server', undefined)) {
        let name = _.get(this.field, 'server', null);
        let isCustomStore = (name.split('.').length > 1 || name.split('/').length > 1)
        try {
          isCustomStore ? this.$store.dispatch(name.replace('.', '/'), this.field) : this.$store.dispatch(`commonSelect/server`, this.field);
        } catch (e) {
        }
      }
    }
  },
  computed: {
    isServerOrStore() {
      return !!_.get(this.field, 'server', _.has(this.field, 'store'));
    },
    selectItems() {
      if (_.get(this.field, 'store', undefined)) {
        let name = _.get(this.field, 'store', null);
        let isCustomStore = (name.split('.').length > 1 || name.split('/').length > 1)
        return !isCustomStore ? _.get(this.$store.state, `commonSelect.${name}`, []) : _.get(this.$store.state, name.replace('/', '.'), []);
      } else if (_.get(this.field, 'server', undefined)) {
        let name = _.get(this.field, 'server', null);
        let isCustomStore = (name.split('.').length > 1 || name.split('/').length > 1)
        return isCustomStore ? _.get(this.$store.state, `${name.replace('/', '.')}`, []) : this.$store.state.commonSelect.server[name] || []
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
