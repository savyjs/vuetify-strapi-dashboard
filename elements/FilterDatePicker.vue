<template>
  <v-menu
    ref="fromDateMenu"
    v-model="fromDateModel"
    :close-on-content-click="false"
    :return-value.sync="data"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        prepend-icon="event"
        :label="label"
        outlined
        dense
        color="primary"
        :value="jdata"
        class="mx-1"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      :show-current="true"
      reactive
      color="primary"
      locale="fa-ir"
      v-model="data"
      scrollable
      @input="$refs.fromDateMenu.save(data)"
    >
    </v-date-picker>
  </v-menu>
</template>
<script>
  export default {
    props: ['value', 'label'],
    data() {
      return {
        fromDateModel: null,
        fromDateMenu: null,
        data: this.value
      }
    },
    computed: {
      jdata() {
        return this.data ? this.$Helper.toJalaali(this.data, 'jYYYY/jM/jD') : ''
      }
    },
    watch: {
      data(val) {
        return this.$emit('input', val)
      }
    }
  }
</script>
