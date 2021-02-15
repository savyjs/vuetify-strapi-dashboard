import _ from 'lodash'

export default {
  data() {
    return {
      loader: false,
      validity: null,
      canSave: false,
      name: "",
      fields: [],
      formData: {},
      btn: {},
      showBack: true,
      showSimple: true,
      isModal: false,
      ...this.value
    }
  },
  computed: {
    type() {
      return _.has(this, 'formData.id') ? 'edit' : 'create'
    },
    back() {
      return '/admin/' + this.name
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
    this.loadData();
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
      return this.$router.push(this.back + '/print')
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
