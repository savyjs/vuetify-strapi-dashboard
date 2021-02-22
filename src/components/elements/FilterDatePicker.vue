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
        readonly
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
      :locale="getLocale"
      v-model="data"
      scrollable
      @input="$refs.fromDateMenu.save(data)"
    >
    </v-date-picker>
  </v-menu>
</template>
<script>
  export default {
    props: ['value', 'label', 'locale'],
    data() {
      return {
        fromDateModel: null,
        fromDateMenu: null,
        data: this.value
      }
    },
    computed: {
      getLocale() {
        return _.get(this, 'locale', _.get(this.vsd, 'locale', undefined));
      },
      jdata() {
        return this.data ? (_.get(this.vsd, 'locale', undefined) !== 'fa-IR' ? this.$Helper.toJalaali(this.data, 'jYYYY/jM/jD') : this.data) : ''
      }
    },
    watch: {
      data(val) {
        return this.$emit('input', val)
      }
    }
  }
</script>
