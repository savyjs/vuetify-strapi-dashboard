<template>
  <div>
    <v-row>
      <v-col
        v-for="field in fields"
        v-if="_.get(field,type,undefined)!==false"
        :key="field.value"
        :cols="_.get(field,'cols',12)"
        :sm="_.get(field,'sm',undefined)"
        :md="_.get(field,'md',undefined)"
        :lg="_.get(field,'lg',undefined)"
      >
        <CommonTypesField
          :formData="formData"
          :field="field"
          @updateFormData="updateFormData"
          :type="field.type"
          v-model="formData[field.value]"
        ></CommonTypesField>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import _ from "lodash"

export default {
  props: ['value', 'name', 'type', 'fields', 'title'],
  data() {
    return {
      formData: {
        ...this.value
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.formData = val;
      },
      deep: true
    },
    formData: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true,
    }
  },
  created() {
    this._ = _;
  },
  methods: {
    updateFormData(val) {
      this.formData = {...this.formData, ...val};
    },
    save() {
      this.$emit('input', this.formData)
      this.$emit('save', this.formData)
    },
  }
}
</script>
