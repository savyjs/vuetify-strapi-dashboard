import _ from 'lodash'

export default {
  props: ['value', 'id'],
  data() {
    return {
      loader: false,
      validity: null,
      icon: undefined,
      headerIcon: undefined,
      canSave: false,
      resource: "",
      title: "",
      name: "",
      fields: [],
      formData: {},
      btn: {},
      showBack: true,
      showSave: true,
      showSimple: false,
      isModal: false,
      ...this.value
    }
  },
  computed: {
    type() {
      return this.id ? 'edit' : 'create'
    },
    backUrl() {
      return this.name
    }
  },
  watch: {
    value: {
      handler(val) {
        _.assign(this.data, val);
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
    print() {
      let config = this.config;
      let formData = this.formData;
      console.log({config, formData});
      this.$store.commit('common/updatePrintFormData', {formData, config});
      return this.$router.push(this.backUrl + '/print')
    },
    doAction(btn) {
      let module = _.get(btn, 'module', undefined);
      if (module) {
        console.log(1, {module})
        module.then(res => {
          res.default(this);
        });
      }
      let action = _.get(btn, 'action', 'save');
      _.result(this, action, null);
    },
  }
}
