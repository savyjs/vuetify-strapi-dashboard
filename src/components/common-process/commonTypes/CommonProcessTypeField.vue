<template>
  <div>
    <CommonTypesField
      :formData="formData"
      :field="field"
      @updateFormData="updateFormData"
      :type="element.type"
      v-model="data"
    ></CommonTypesField>
  </div>
</template>
<script>
  import _ from 'lodash'

  const fields = {};
  export default {
    props: ['value', 'element', 'formData', 'id', 'type', 'config'],
    data() {
      return {
        data: this.value,
      }
    },
    created() {
      this._ = _;
    },
    computed: {
      field() {
        return {
          text: this.element.title,
          value: this.element.value,
          ...this.element
        };
      }
    },
    methods: {
      loadElement(config) {
        let id = this.id
        if (id) {
          let url = this.vsd.builder.element;
          this.$axios.$get(url + '/' + id).then(res => {
            this.element = res;
          }).catch(err => {
            this.$notifWarning('ELEMENT_LOAD_ERROR')
          })
        } else if (this.element) {
          return this.element
        } else {
          this.$notifWarning('ELEMENT_ID_NOT_FOUND')
        }
      },
      updateFormData() {

      }
    },
    watch: {
      value: {
        handler(val) {
          this.data = val;
        }, deep: true
      },
      data: {
        handler(val) {
          this.$emit('input', val)
        }, deep: true
      }
    },
    mounted() {
      this.loadElement(this.config);
    }
  }
</script>
