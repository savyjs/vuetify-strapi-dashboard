<template>
  <div>
    <v-row>
      <v-col sm="12" lg="7">
        <v-text-field filled dense label="عنوان" v-model="nameValue"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>

  export default {
    props: ['value', 'name', 'title'],

    data() {
      return {
        nameValue: null
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
        return {}
      }
    },
    methods: {
      updateForm(data) {
        // update form here
      },
      save() {
        this.$emit('input', this.formData)
        this.$emit('save', this.formData)
        this.$router.push('../')
      }
    }
  }
</script>
