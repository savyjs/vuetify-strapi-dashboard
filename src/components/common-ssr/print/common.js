const notColons = ['label', 'linearCrud', 'crud'];

export default {
  props: ['value', 'main'],
  data() {
    return {
      ...this.main,
      formData: {},
      notColons,
      loader: false
    }
  },
  computed: {
    getHeaders() {
      let headers = [];
      for (let item of this.fields) {
        if (item.pop === undefined || item.pop === true) headers.push(item)
      }
      return headers;
    },
    item() {
      return _.get(this, 'value', {});
    },
    back() {
      return '/admin/' + this.name
    }
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
  mounted() {
    this.loadData();
  },
  methods: {
    hasColon(field) {
      let notColons = [...this.notColons];
      return (field.type && !_.includes(notColons, field.type));
    },
    loadData() {
      this.formData = _.get(this.$store.state, `common.printFormData[${this.name}]`, []);
      if (!_.isPlainObject(this.formData)) {
        this.$alertError(this.$t("error"));
      } else {
        this.value = this.formData;
      }
    },
    canPrint(field) {
      return _.get(field, 'print', _.get(field, 'show', undefined)) !== false;
    },
    print() {
      return _.get(field, 'print', _.get(field, 'show', undefined)) !== false;
    }
  }
}
