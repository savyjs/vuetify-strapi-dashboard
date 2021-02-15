import _ from 'lodash'

export default {
  data() {
    return {
      loader: false,
      formData: {},
      title: "",
      resource: "",
      name: "",
      fields: [],
      ...this.value
    }
  },
  mounted() {
    this.loadData();
  },
  watch: {
    value: {
      handler(val) {
        this.formData = val;
      },
      deep: true
    },
    formData: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  computed: {
    getHeaders() {
      let headers = [];
      for (let item of this.fields) {
        if (item.show === undefined || item.show === true) headers.push(item)
      }
      return headers;
    },
    item() {
      return _.get(this, 'value', {});
    },
    back() {
      return this.name ? '/admin/' + this.name : './.'
    }
  },
  created() {
    this._ = _;
  },
  methods: {
    hasPermission(field) {
      if (_.has(field, 'permission')) return this.can(_.get(field, 'permission', null))
      return true;
    },
    canShow(field) {
      //console.log(_.get(field, 'show', undefined) !== false, {field})
      return _.get(field, 'show', undefined) !== false;
    }
  }
}
