import _ from 'lodash'

export default {
  data() {
    return {
      loader: false,
      validity: null,
      isModal: false,
      status: "",
      meta: {},
      formId: null,
      formData: {},
      ...this.config
    }
  },
  computed: {
    type() {
      return this.id ? 'edit' : 'create'
    },
    backUrl() {
      return this.path
    }
  },
  watch: {
    value: {
      handler(val) {
        _.assign(this.formData, val);
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
    if (this.type !== 'create') {
      this.loadData();
    }
  },
  created() {
    this._ = _;
  },
  methods: {
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    doAction(btn) {
      let module = _.get(btn, 'module', undefined);
      if (module) {
        module.then(res => {
          res.default(this);
        });
      }
      let action = _.get(btn, 'action', 'save');
      _.result(this, action, null);
    },
  }
}
