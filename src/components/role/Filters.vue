<template>
  <v-row>
    <v-col cols="12">
      <div>
        <v-text-field clearable dense v-model="search" outlined label="جست و جو" @keydown.enter="doSearch" @change="doSearch"
                      append-icon="search"></v-text-field>
      </div>
    </v-col>
    <v-col v-if="false" cols="12" md="6" lg="4">
      <div>
        <v-text-field dense v-model="id" outlined label="شناسه"></v-text-field>
      </div>
    </v-col>
    <v-col cols="12" lg="12" class="text-left">
      <v-btn  v-if="false"  color="info" @click="filter">
        <v-icon class="mx-1">search</v-icon>
       فیلتر
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
  export default {
    props: ['value'],
    data() {
      return {
        id: null,
        search: ''
      }
    },
    watch: {
      value(obj) {
        _.forEach(obj, (key, val) => {
          _.set(this, key, val)
        })
      }
    },
    computed: {
      formData() {
        return {
          id: this.id,
        }
      }
    },
    methods: {
      filter() {
        this.$emit('input', this.formData);
      },
      doSearch() {
        this.$emit('search', this.search);
      }
    }
  }
</script>
