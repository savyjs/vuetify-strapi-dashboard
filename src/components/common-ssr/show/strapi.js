export default {
  methods: {
    loadData() {
      console.log(this.getFields)
      let id = this.id;
      if (!id) {
        return this.$notifError(this.$t("problem_id"));
      }
      this.loader = true;
      this.$axios.$get(this.resource + '/' + id).then(res => {
        this.formData = {id, ...res};
      }).catch(err => {
        this.$notifError(err);
      }).finally(() => {
        this.loader = false;
      })
    },
    update(oldId, property, val) {
      let id = _.get(this.formData, 'id', _.get(this, 'id', oldId));
      //console.log({oldId, formData: this.formData, id, property, val})
      if (!id) return this.$notifError(this.$t('can_not_update'));
      let data = {};
      data[property] = val;
      return this.$axios.$put(this.resource + '/' + id, data).then(res => {
        this.loadData();
        this.$notifSuccess(this.$t('successful'))
      }).catch(err => {
        this.$notifError(this.$t(err))
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
        this.$notifSuccess(this.$t('successful'))
        this.formData.id = _.get(res, 'id', id);
      }).catch(e => {
        this.$notifError(e)
      }).finally(() => {
        this.loader = false;
      })
    }
  },
  computed: {
    backUrl() {
      return this.name ? '/admin/' + this.name : './.'
    }
  }
}
