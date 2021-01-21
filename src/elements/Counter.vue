<template>
  <div>
    <small class="pr-5 mr-5">
      {{label}}
    </small>
    <v-text-field
      :prepend-icon="icon"
      :outlined="outlined"
      :filled="!outlined"
      color="primary"
      class="text-center passengers-number"
      dense
      :min="field.min"
      @keydown.up="data++"
      @keydown.down="data--"
      light
      v-model="data"
    >
      <template v-if="!_.has(field,'max') || _.get(field,'max',null) > data" v-slot:prepend-inner>
        <v-chip class="mb-1" @click="data++">
          <v-icon class="font-10">fa-plus</v-icon>
        </v-chip>
      </template>
      <template v-if="!_.has(field,'min') || _.get(field,'min',null) < data" v-slot:append>
        <v-chip class="mb-1" @click="data--">
          <v-icon class="font-10">fa-minus</v-icon>
        </v-chip>
      </template>
    </v-text-field>
  </div>
</template>
<script>
  export default {
    props: ['value', 'label', 'field', 'outlined', 'icon'],
    data() {
      return {
        data: 0,
      }
    },
    mounted() {
      this.data = parseInt(this.$Helper.faToEn(_.isNumber(this.value) ? this.value : (_.get(this.field, 'min', 0))));
    },
    watch: {
      data: {
        handler(val) {
          this.$emit('input', val);
        },
        deep: true
      }
    }
  }
</script>
