<template>
  <div v-if="_.includes(['boolEdit','bool'],type)">
    <small>{{_.get(field,'text',null)}}:</small>
    <v-btn icon :disabled="field.edit===false" @click="toggle(!value)">
      <v-icon dense color="success" v-if="value==true">check</v-icon>
      <v-icon dense color="warning" v-if="value==null">info</v-icon>
      <v-icon dense color="error" v-if="value==false">close</v-icon>
    </v-btn>
  </div>
  <div v-else>
    <span v-if="_.get(field,'text',null)">{{field.text}}: </span>
    <common-types-show :item="item"  v-if="field" :field="field" :fields="fields" :type="type" v-model="value"/>
  </div>
</template>
<script>
  import CommonTypesShow from "./CommonTypesShow";

  export default {
    components: {CommonTypesShow},
    /**
     * @value: any - this property value
     * @type: String - this property type - image bool text rich ...
     * @item: Object - all properties of item
     * @field: Object - filed properties
     * */
    props: ['value', 'type', 'item', 'field', 'fields'],
    data() {
      return {}
    },
    methods: {
      toggle(value) {
        let name = _.get(this.field, 'value', undefined);
        let id = _.get(this.item, 'id', undefined);
        if (this.field.edit !== undefined && name) {
          this.$emit('toggle', id, name, value)
        }
      }
    }
  }
</script>
