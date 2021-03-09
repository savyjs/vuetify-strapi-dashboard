import _ from 'lodash';
import qs from "qs";

export default {
  methods: {
    loadData() {
      this.loading = true;
      let url = this.vsd.builder.record;
      this.$axios.$get(url + '/' + this.id).then(res => {
        this.data = res;
        this.formData = _.get(res,'data',{});
      }).catch(error => {
        this.$notifWarning(error);
      }).finally((res) => {
        this.loading = false;
      })
    },
    loadElements() {
      let id = this.formId;
      let url = this.vsd.builder.form;
      let gurl = this.vsd.builder.group;
      this.elements = [];
      this.$axios.$get(url + '/' + id).then(res => {
        _.forEach(_.get(res, 'groups', []), (group) => {
          this.$axios.$get(gurl + '/' + group.id).then(groupDetails => {
            _.forEach(_.get(groupDetails, 'elements', []), (element) => {
              element = {
                text: element.title,
                value: `data.${group.name}.${element.name}`,
                ...element
              }
              this.elements.push(element)
            })
          }).catch(gerr => {
            console.error({gerr})
          })
        })
      }).catch(err => {
        console.error({err})
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
