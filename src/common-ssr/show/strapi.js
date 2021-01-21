import common from './common'

export default {
  ...common,
  getData: {
    ...common.getCommonData,
    loader: false,
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
  methods: {
    ...common.getMethods,
    hasPermission(field) {
      if (_.has(field, 'permission')) return this.$can(_.get(field, 'permission', null))
      return true;
    },
    loadData() {
      let id = _.get(this.formData, 'id', null);
      if (!id) return;
      this.loader = true;
      this.$axios.$get(this.resource + '/' + id).then(res => {
        //console.log({res})
        this.formData = {id,...res};
      }).catch(err => {
        this.$notifError(err);
      }).finally(() => {
        this.loader = false;
      })
    },
    update(oldId, property, val) {
      let id = _.get(this.formData, 'id', _.get(this, 'id', oldId));
      //console.log({oldId, formData: this.formData, id, property, val})
      if (!id) return this.$notifError('مشکلی در بروزرسانی رخ داد');
      let data = {};
      data[property] = val;
      return this.$axios.$put(this.resource + '/' + id, data).then(res => {
        this.loadData();
        this.$notifSuccess('با موفقیت بروز شد')
      }).catch(err => {
        this.$notifError(err)
      })
    },
    save() {
      this.loader = true;
      let formData = this.formData;
      //console.log({formData})
      let id = this.formData.id;
      let response;
      if (id) {
        response = this.$axios.$put(this.resource + '/' + id, formData);
      } else {
        response = this.$axios.$post(this.resource, formData);
      }
      response.then(res => {
        this.$notifSuccess('با موفقیت انجام شد')
        this.formData.id = _.get(res, 'id', id);
      }).catch(e => {
        this.$notifError(e)
      }).finally(() => {
        this.loader = false;
      })
    }
  }
}
