import _ from 'lodash'

export default {
  data() {
    return {
      loader: false,
      showBack: true,
      headerIcon: undefined,
      editItem: undefined,
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
        _.assign(this, val);
      },
      deep: true
    }
  },
  computed: {
    getFields() {
      let items = [];
      for (let item of this.fields) {
        if (item.show === undefined || item.show === true) items.push(item)
      }
      return items;
    },
    item() {
      return _.get(this, 'value.formData', {});
    }
  },
  created() {
    this._ = _;
  },
  methods: {
    hasPermission(field) {
      try {
        if (_.has(field, 'permission')) return this.can(_.get(field, 'permission', null))
        return true;
      } catch (e) {
        return true;
      }
    },
    canShow(field) {
      try {
        return _.get(field, 'show', undefined) !== false;
      } catch (e) {
        return true;
      }
    }
  }
}
