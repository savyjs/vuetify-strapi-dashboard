<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    bottom
    app
    left
    :multi-line="_.get(text,'length',10) > 70"
    :timeout="timeout"
  >
    {{ text }}
  </v-snackbar>
</template>
<script>
import Vue from 'vue'
import _ from 'lodash'

export default {
  props: ['value'],
  data() {
    return {
      queue: [],
      snackbar: false,
      text: 'پیام نامشخص',
      timeout: 4000,
      color: 'info',
    }
  },
  watch: {
    snackbar(val) {
      if (val == false) {
        if (_.has(this.queue, '[0].msg')) {
          setTimeout(() => {
            this.showMsg(this.queue[0]['msg'], this.queue[0]['type']);
            this.queue.shift();
          }, 200);
        }
      }
    }
  },
  methods: {
    showMsg(msg, type) {
      if (this.snackbar == false) {
        this.text = msg;
        this.color = type;
        this.snackbar = true;
      } else {
        let obj = {msg, type}
        this.queue.push(obj);
      }
    }
  },
  created() {
    this._ = _;
    const notifError = (msg) => {
      console.log({error: msg})
      let error = msg;
      if (_.has(error, 'response.data.errors[0][0]')) {
        msg = error.response.data.errors[0][0];
      } else if (_.has(error, 'response.data.message[0].messages[0].message')) {
        msg = error.response.data.message[0].messages[0].message;
      } else if (_.has(error, 'response.data.message')) {
        msg = _.get(error, 'response.data.message', msg)
      }
      this.showMsg(msg, 'error');
    }

    const notifSuccess = (msg) => {
      // console.log({success: msg})
      this.showMsg(msg, 'success');
    }

    const notifWarning = (msg) => {
      // console.log({warning: msg})
      this.showMsg(msg, 'warning');
    }
    const notifInfo = (msg) => {
      // console.log({info: msg})
      this.showMsg(msg, 'info');
    }

    Vue.set(Vue.prototype, 'notifError', notifError);
    Vue.set(Vue.prototype, '$notifError', notifError);

    Vue.set(Vue.prototype, 'notifWarning', notifWarning);
    Vue.set(Vue.prototype, '$notifWarning', notifWarning)

    Vue.set(Vue.prototype, 'notifSuccess', notifSuccess);
    Vue.set(Vue.prototype, '$notifSuccess', notifSuccess);

    Vue.set(Vue.prototype, 'notifInfo', notifInfo);
    Vue.set(Vue.prototype, '$notifInfo', notifInfo);

  }
}
</script>
