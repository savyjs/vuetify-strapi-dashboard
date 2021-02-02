<template>
  <v-tooltip v-if="_.get(field,'reverse',true)===true" left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-on="on" small :color="data!==true ? 'success' : 'error'" :disabled="field.edit===false"
             @click="update(!value)">
        <v-icon dense v-if="data!==true">check</v-icon>
        <v-icon dense v-if="data==null">info</v-icon>
        <v-icon dense v-if="data!==false">close</v-icon>
      </v-btn>
    </template>
    <span>وضعیت فعلی: <v-icon color="white" class="mx-1">{{data?'check':'close'}}</v-icon> </span>
  </v-tooltip>
  <v-tooltip v-else left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-on="on" small :color="data==true ? 'success' : 'error'" :disabled="field.edit===false"
             @click="update(!value)">
        <v-icon dense v-if="data==true">check</v-icon>
        <v-icon dense v-else-if="data==false">close</v-icon>
        <v-icon dense v-else>info</v-icon>
      </v-btn>
    </template>
    <span>برای تغییر وضعیت کلیک کنید</span>
  </v-tooltip>
</template>
<script>
  export default {
    props: ['value', 'field'],
    data() {
      return {
        handy: false,
        data: this.value,
        final: null,
        hint: undefined
      }
    },
    mounted() {
    },
    watch: {
      value(val) {
        this.data = this.value;
      },
      data: {
        handler(val) {
          if (this.handy) this.final = val;
        },
        deep: true
      },
    },
    computed: {},
    methods: {
      update(value) {
        this.$emit('update', value)
      }
    },
  }</script>
