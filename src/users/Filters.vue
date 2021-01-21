<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div>
          <v-text-field clearable dense v-model="search" outlined label="جست و جو" @keydown.enter="doSearch"
                        @change="doSearch"
                        append-icon="search"></v-text-field>
        </div>
      </v-col>
    </v-row>
    <v-row @keydown.enter="filter">
      <v-col cols="12" md="6" lg="4">
        <v-text-field append-icon="input" dense v-model="id" outlined label="شناسه"></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-text-field append-icon="input" dense v-model="username" outlined label="نام کاربری"></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-text-field append-icon="input" dense v-model="email" outlined label="ایمیل"></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-text-field append-icon="input" dense v-model="mobile" outlined label="موبایل"></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-text-field append-icon="input" dense v-model="name" outlined label="نام"></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-text-field append-icon="input" dense v-model="lastname" outlined label="نام خانوادگی"></v-text-field>
      </v-col>
      <v-col cols="12" lg="12" class="text-left">
        <v-btn small color="info" @click="filter">
          <v-icon class="mx-1">search</v-icon>
          فیلتر
        </v-btn>
        <v-btn small color="success darken-3" @click="filter">
          <v-icon class="mx-1">move_to_inbox</v-icon>
          گزارش
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  export default {
    props: ['value'],
    data() {
      return {
        id: null,
        username: null,
        email: null,
        mobile: null,
        name: null,
        lastname: null,
        search: '',
      }
    },
    watch: {
      value(obj) {
        _.forEach(obj, (key, val) => {
          _.set(this, key, val)
        })
      },
    },
    computed: {
      formData() {
        let filters = {};
        if (this.id) filters.id = this.id;
        if (this.username) filters.username = this.username;
        if (this.name) filters.name = this.name;
        if (this.email) filters.email = this.email;
        if (this.mobile) filters.mobile = this.mobile;
        if (this.lastname) filters.lastname = this.lastname;
        return filters;
      }
    },
    methods: {
      filter() {
        this.$emit('input', this.formData);
        return false;
      },
      doSearch(val) {

        // search after 1 second's
        setTimeout(() => {
          if (this.search == val) {
            this.$emit('search', this.search);
          }
        }, 500)

      }
    }
  }
</script>
