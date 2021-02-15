import common from './common'

export default {
  mixins: [common],
  methods: {
    loadData() {
      let id = _.get(this.formData, 'id', null);
      if (!id) {
        this.canSave = true;
        return;
      }
      this.loader = true;
      this.$axios.$get(this.resource + '/' + id).then(res => {
        this.formData = {...this.formData, ...res};
        //console.log({res}, this.formData)
        this.canSave = true;
      }).catch(err => {
        this.$notifError(err);
      }).finally(() => {
        this.loader = false;
      })
    },
    save(show = false) {
      this.loader = true;
      let formData = this.formData;
      // console.log({formData})
      let id = this.formData.id;
      let response;
      if (id) {
        response = this.$axios.$put(this.resource + '/' + id, formData);
      } else {
        response = this.$axios.$post(this.resource, formData);
      }
      response.then(res => {
        this.$notifSuccess('با موفقیت ذخیره شد')
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
