export default {
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
