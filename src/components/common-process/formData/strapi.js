import _ from 'lodash';

export default {
  methods: {
    loadData() {
      let url = this.vsd.builder.record;
      let id = this.id;
      if (!id) {
        return this.$notifError(this.$t("problem_id"));
      }
      this.loader = true;
      this.$axios.$get(url + '/' + id).then(res => {
        this.meta = {...res.meta};
        this.formData = {...this.formData, ...res.data};
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
      let request = {
        form: this.formId,
        data: this.formData,
      };
      if (id) request.id = id;
      let url = this.vsd.builder.record;
      if (id) {
        response = this.$axios.$put(url + '/' + id, request);
      } else {
        response = this.$axios.$post(url, request);
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
