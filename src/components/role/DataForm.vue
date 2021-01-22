<template>
  <div>
    <v-row>
      <v-col sm="12" lg="7">
        <v-text-field
          v-model="data.name"
          dense
          filled
          required
          label="نام سیستمی"
        />
      </v-col>
      <v-col sm="12" lg="7">
        <v-textarea
          v-model="data.description"
          dense
          filled
          required
          label="توضیحات"
        />
      </v-col>
    </v-row>
    <v-subheader>دسترسی ها</v-subheader>
    <permission-table :permissionsConfig="permissionsConfig" v-model="data.permissions"/>
  </div>
</template>

<script>

  import PermissionTable from "../permissions/PermissionTable";

  export default {
    props: ['value', 'permissionsConfig'],
    data() {
      return {
        data: {
          ...this.value,
          permissions: {},
          name: '',
        },
      }
    },
    computed: {
      formData() {
        return this.data;
      },
    },
    watch: {
      value: {
        handler(val) {
          this.updateForm(val);
        },
        deep: true,
      },
      formData: {
        deep: true,
        handler(val) {
          this.$emit('input', val)
        }
      }
    },
    mounted() {
      this.loadOptions();
    },
    methods: {
      loadOptions() {
        let loadData = this.value;
        if (_.isPlainObject(loadData)) {
          _.map(loadData, (key, val) => {
            this.data[key] = val;
          })
        }
      },
      updateForm(data) {
        this.data = data;
      },
    },
    components: {PermissionTable},

  }
</script>
