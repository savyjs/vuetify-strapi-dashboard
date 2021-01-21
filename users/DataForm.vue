<template>
  <div>
    <v-row>
      <v-col sm="12" lg="7">
        <v-text-field
          v-validate="{ required: true, regex: /^[a-zA-Z]+$/ }"
          data-vv-name="username"
          :error-messages="errors.collect('username')"
          filled dense label="نام کاربری" v-model="username"/>
      </v-col>
      <v-col sm="12" lg="7">
        <v-text-field filled dense label="نام" v-model="name"/>
      </v-col>
      <v-col sm="12" lg="7">
        <v-text-field filled dense label="نام خانوادگی" v-model="lastname"/>
      </v-col>
      <v-col sm="12" lg="7">
        <v-text-field filled dense label="کد ملی" v-model="nationalCode"/>
      </v-col>
      <v-col sm="12" lg="7">
        <v-text-field
          v-validate="'digits:11'"
          data-vv-name="mobile"
          ref="mobile"
          :error-messages="errors.collect('mobile')"
          filled dense label="شماره موبایل" v-model="mobile"/>
      </v-col>
      <v-col sm="12" lg="7">
        <v-text-field
          v-model="email"
          dense
          filled
          v-validate="'required|email'"
          data-vv-name="email"
          :error-messages="errors.collect('email')"
          required
          label="ایمیل"
        />
      </v-col>
      <v-col sm="12" lg="7">
        <v-text-field
          v-validate="'required'"
          data-vv-name="password"
          v-model="password"
          :error-messages="errors.collect('password')"
          filled dense label="رمز عبور" type="password" />
      </v-col>

    </v-row>
  </div>
</template>

<script>

  export default {

    props: ['value'],

    data() {
      return {
        username: null,
        name: null,
        lastname: null,
        nationalCode: null,
        email: null,
        password: null,
        mobile: null,
      }
    },
    watch: {
      value(val) {
        this.updateForm(val);
      },
      formData: {
        deep: true,
        handler(val) {
          this.$emit('input', val)
        }
      }
    },
    computed: {
      formData() {
        return {
          username: this.username,
          name: this.name,
          lastname: this.lastname,
          password: this.password,
          email: this.email,
          mobile: this.mobile,
        }
      }
    },
    methods: {
      updateForm(data) {
        // update form here
      },
      save() {
        this.loader = true;
        this.$validator.validateAll().then(res => {
          this.$emit('input', this.formData)
          this.$emit('change', this.formData)
          this.$router.push('../')
        }).catch(err => {
          this.$Helper.showError(err, this.$swal, this.$router)
        }).finally(() => {
          this.loader = false;
        })
      }
    },
    $_veeValidate: {
      validator: 'new'
    },
  }
</script>
