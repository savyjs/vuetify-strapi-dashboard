<template>
  <section class="loginBackground">
    <v-container class="mt-5">
      <v-form @submit.prevent lazy-validation v-model="validityLogin">
        <v-row justify="center">
          <v-col sm="12" md="8" lg="6">
            <v-card :loading="loader">
              <v-card-title>
                <v-row>
                  <v-col cols="12" class="text-center grey--text">
                    <v-icon class="font-70">account_circle</v-icon>
                    <br/>
                    <h3>
                      {{ $t('Login') }}
                    </h3>
                  </v-col>
                  <v-col cols="12">
                    <v-alert type="info">
                      <small>{{ $t('welcome_to_vs_dashboard') }}</small>
                    </v-alert>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-layout>
                  <v-flex sm="10" offset="1">
                    <v-text-field
                      filled
                      placeholder=""
                      :label="$t('username')"
                      autofocus
                      v-model="username"
                      v-on:keyup.enter="login"
                    ></v-text-field>
                    <v-text-field
                      filled
                      placeholder=""
                      :label="$t('password')"
                      :type="!toggle ? 'password' : 'text'"
                      v-model="password"
                      v-on:keyup.enter="login"
                    >
                      <template v-if="showPassword && toggle" v-slot:append>
                        <v-btn icon class="mb-1" @click="toggle=!toggle">
                          <v-icon>visibility_off</v-icon>
                        </v-btn>
                      </template>
                      <template v-else-if="showPassword" v-slot:append>
                        <v-btn icon class="mb-1" @click="toggle=!toggle">
                          <v-icon>visibility</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions class="pb-5">
                <v-row justify="center">
                  <v-col xs="10" sm="6" lg="4">
                    <v-btn :disabled="!validityLogin"
                           :loading="loader" block
                           @click="login" color="success">
                      <v-icon small class="mx-1">lock</v-icon>
                      <span>{{ $t('login') }}</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </section>
</template>
<i18n>
{
  "en": {
    "welcome_to_vs_dashboard": "welcome to VS dashboard",
    "error": "error",
    "recaptcha_error": "Recaptcha not loaded"
  },
  "fa": {
    "welcome_to_vs_dashboard": "به پنل مدیریت خوش آمدید",
    "error": "ریکپچا بارگذاری نشده است",
    "recaptcha_error": "ریکپچا بارگذاری نشده است"
  }
}
</i18n>
<script>

import _ from 'lodash'

const isNumber = v => (!isNaN(v)) || 'must be numeric'
export default {
  name: 'VsdLogin',
  data() {
    return {
      timer: 0,
      validityLogin: null,
      validity2FA: null,
      validity2FASendCode: null,
      userCodeSent: false,
      showPassword: false,
      toggle: false,
      loader: false,
      username: "",
      code: "",
      stage: "inputUsername",
      password: ""
    }
  },
  async mounted() {
    this.has2FAenabled = _.get(this, 'vsd.ENABLE_2FA', false);
    this.showPassword = _.get(this, 'vsd.SHOW_PASSWORD', true);
    try {
      await this.$recaptcha.init();
    } catch (e) {
      console.warn('please add @nuxt/recaptcha module');
    }
    this.clearToken();
  },
  computed: {
    usernameRules() {
      return [_.get(this, 'vsd.validations.isNumber', ''), _.get(this, 'validations.isPhone', '')]
    },
    passwordRules() {
      return [_.get(this, 'vsd.validations.checkPassword', '')]
    },
    codeRules() {
      return [_.get(this, 'vsd.validations.isNumber', ''), _.get(this, 'validations.isCode', '')]
    }
  },
  methods: {
    clearToken() {
      this.$auth.logout();
      try {
        this.$strapi.clearToken();
      } catch (e) {
        console.warn('module nuxt/strapi not found')
      }
    },
    startTimer(init = false) {
      if (init) this.timer = 60;
      if (this.timer > 0) {
        setTimeout(() => {
          this.timer -= 1;
          this.startTimer();
        }, 1000)
      }
    },
    async login() {
      let token;
      try {
        token = await this.$recaptcha.execute('login')

      } catch (e) {
        console.error({e})
      }

      if (this.$recaptcha && !token) {
        return this.$swal({
          type: 'error',
          title: this.$t('error'),
          text: this.$t("recaptcha_error")
        })
      }

      if (this.username.length < 1 || this.password.length < 6) {
        return this.$swal({
          type: 'error',
          title: 'Error!',
          text: 'please check your credentials.'
        })
      }
      this.loader = true;

      this.$auth.loginWith('admin', {
        data: {
          identifier: this.username,
          password: this.password,
          token
        }
      }).then(res => {
          if (_.has(res, 'data.jwt')) {
            try {
              this.$strapi.setToken(res.data.jwt, false);
            } catch (e) {
              console.warn('module nuxt/strapi not found')
            }
          } else {
            this.$swal({type: 'error', title: 'login error', text: msg})
            return this.$notifError('login error');
          }
          /* this.$router.push('/admin') */
        }
      ).catch(err => {

        let msg = _.get(err, 'message', 'Error')
        this.$swal({type: 'error', title: 'Error', text: msg})

        this.$notifError(msg);
      }).finally(() => {
        this.loader = false;
      })
    },

    forgetPassword() {
      if (this.username.length < 1) {
        this.$store.commit("snackbar/setColor", 'error')
        this.$store.commit("snackbar/setSnack", 'please check your credential')
      }
      this.loader = true;
      this.$axios.post('forget', {username: this.username}).then(res => {
          this.stage = 'inputCode'
        }
      ).catch(err => {
        let msg = _.get(err, 'message', 'error')
        this.$notifError(msg);
      }).finally(() => {
        this.loader = false;
      })
    }
  }
}
</script>
<style scoped>

.loginBackground {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-size: 400% 400%;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

</style>
