import _ from 'lodash';

export default {
  methods: {
    loadData() {
      let id = this.id;
      if (!id) {
        return this.$notifError(this.$t("problem_id"));
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
    save() {
      this.loader = true;
      let show = _.get(this, 'redirectAfterSave', false);
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
        if (show && _.get(this, 'showBack', true)) this.$router.push(this.backUrl + '/' + id);
      }).catch(e => {
        this.$notifError(e)
      }).finally(() => {
        this.loader = false;
      })
    }
  }
}
