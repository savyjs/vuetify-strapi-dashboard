<template>
  <v-alert
    close-label="close"
    v-model="alert"
    :type="color"
    dismissible
    elevation="1"
  >
    {{ text }}
  </v-alert>
</template>

<i18n>
  {
  "en":{
  "unknown_error":"permission denied"
  },
  "fa":{
  "unknown_error":"پیغام نامشخص"
  }
  }
</i18n>
<script>
  // import Helper from '~/assets/js/Helper.js'
  import Vue from 'vue'

  export default {
    props: ['value'],
    data() {
      return {
        text: '',
        queue: [],
        alert: false,
        timeout: 30000,
        color: 'info',
      }
    },
    computed: {},
    watch: {
      alert(val) {
        if (val == false) {
          if (_.has(this.queue, '[0].msg')) {
            setTimeout(() => {
              this.showMsg(this.queue[0]['msg'], this.queue[0]['type']);
              this.queue.shift();
            }, 200);
          }
        } else {
          setTimeout(() => {
            this.alert = false;
          }, this.timeout)
        }
      }
    },
    methods: {
      nl2br(str) {
        return $Helper.nl2br(str)
      },
      showMsg(msg, type) {
        if (this.alert == false) {
          this.text = msg;
          this.color = type;
          this.alert = true;
        } else {
          let obj = {msg, type}
          this.queue.push(obj);
        }
      }
    },
    mounted: function () {
      this.text = this.$t("unknown_error")
    },
    created: function () {
      const alertError = (msg) => {
        let error = msg;
        if (_.has(error, 'response.data.message')) {
          msg = _.get(error, 'response.data.message', msg)
        }
        this.showMsg(msg, 'error');
      }

      const alertSuccess = (msg) => {
        this.showMsg(msg, 'success');
      }

      const alertWarning = (msg) => {
        this.showMsg(msg, 'warning');
      }

      const alertInfo = (msg) => {
        this.showMsg(msg, 'info');
      }

      Vue.set(Vue.prototype, 'alertError', alertError);
      Vue.set(Vue.prototype, '$alertError', alertError);

      Vue.set(Vue.prototype, 'alertWarning', alertWarning);
      Vue.set(Vue.prototype, '$alertWarning', alertWarning)

      Vue.set(Vue.prototype, 'alertSuccess', alertSuccess);
      Vue.set(Vue.prototype, '$alertSuccess', alertSuccess);

      Vue.set(Vue.prototype, 'alertInfo', alertInfo);
      Vue.set(Vue.prototype, '$alertInfo', alertInfo);


    }
  }
</script>
