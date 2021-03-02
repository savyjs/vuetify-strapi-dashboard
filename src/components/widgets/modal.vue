<template>
  <v-dialog
    v-model="popupStatus"
    eager
    width="80%"
  >
    <v-card elevation="5">
      <v-card-title>
        <h3>
          <v-icon>{{_.get(main,'config.icon', 'fa-plus')}}</v-icon>
          {{_.get(main,'config.title', 'عنوان')}}
        </h3>
        <v-spacer/>
        <v-btn fab icon @click="popupStatus=false" small color="error">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <DataFormPage
          v-if="isForm"
          :config="Info"
          :fields="fields"
          :name="name"
          :isModal="true"
          v-model="data"
          :resource="resource"
          :title="title"
        />
        <component :is="modalCustomComponent" v-else-if="modalCustomComponent && isComponent"/>
      </v-card-text>
      <v-card-actions>
        <v-btn small color="error" @click="popupStatus=false">
          <v-icon>close</v-icon>
          بستن
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  import _ from 'lodash'
  export default {
    props: ['value', 'main'],
    data() {
      return {
        data: {},
        popupStatus: this.value,
        fields: _.get(this.main, 'fields', {}),
        Info: _.get(this.main, 'config', {}),
        ..._.get(this.main, 'config', {}),
        modalCustomComponent: null
      }
    },
    computed: {
      isForm() {
        return _.has(this.main, 'fields');
      },
      isComponent() {
        return _.has(this.main, 'component');
      }
    },
    watch: {
      popupStatus(val) {
        this.$emit('input', val);
      }
    },
    async asyncData({params}) {
      return {data: {id: params.id}}
    },
    beforeCreate() {
      if (this.isComponent) {
        this.modalCustomComponent = this.main.component;
      }
    }
  }
</script>
