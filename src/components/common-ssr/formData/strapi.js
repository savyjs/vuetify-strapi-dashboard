export default {
  methods: {
    loadData() {
      let id = _.get(this.formData, 'id', undefined);
      if (!id) {
        this.canSave = true;
        return;
      }
      this.loader = true;
      this.$axios.$get(this.resource + '/' + id).then(res => {
        this.formData = {...this.formData, ...res};
        this.canSave = true;
      }).catch(err => {
        this.$notifError(err);
      }).finally(() => {
        this.loader = false;
      })
    },
    save(show = false) {
      this.loader = true;
      let id = _.get(this.formData, 'id', undefined);
      let response;
      if (id) {
        response = this.$axios.$put(this.resource + '/' + id, this.formData);
      } else {
        response = this.$axios.$post(this.resource, this.formData);
      }
      response.then(res => {
        this.$notifSuccess(this.$t("success"))
        let id = _.get(res, 'id', id);
        this.formData.id = id;
        if (show && _.get(this, 'showBack', true)) this.$router.push(this.back + '/' + id);
      }).catch(e => {
        this.$notifError(e)
      }).finally(() => {
        this.loader = false;
      })
    }
  }
}
