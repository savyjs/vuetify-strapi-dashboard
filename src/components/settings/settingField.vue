<template>
  <div>
    <template v-if="type=='textarea'">
      <v-textarea :label="label" dense filled v-model="input"></v-textarea>
    </template>
    <template v-else-if="type=='photo'">
      <select-photo :label="label" dense filled v-model="input"></select-photo>
    </template>
    <template v-else-if="type=='boolean'">
      <v-switch :label="label" v-model="input"></v-switch>
    </template>
    <template v-else-if="type=='editor'">
      <text-editor
        v-model="input"
        :label="label"
        multiple
        chips
        dense
        filled
      ></text-editor>
    </template>
    <template v-else-if="type=='keywords'">
      <v-combobox
        v-model="input"
        :label="label"
        multiple
        chips
        dense
        filled
      ></v-combobox>
    </template>
    <template v-else-if="type=='crud'">
      <CRUD
        :type="item.subType || null"
        :help="item.help || null"
        v-model="input"
        :label="label"
        dense
        filled
      ></CRUD>
    </template>
    <template v-else>
      <v-text-field :label="label" dense filled v-model="input"/>
    </template>
  </div>
</template>
<script>
  import CRUD from "../elements/CRUD";
  import TextEditor from "../elements/TextEditor";
  import SelectPhoto from "../elements/SelectPhoto";

  export default {
    components: {SelectPhoto, TextEditor, CRUD},
    props: ['value', 'item'],
    data() {
      return {
        dialog: false,
        input: null
      }
    },
    computed: {
      type() {
        return _.get(this.item, 'type', 'text')
      },
      label() {
        return this.$t(_.get(this.item, 'text', 'text'))
      },
      getValue() {
        return this.input
      }
    },
    watch: {
      value(val) {
        this.setInput(val)
      },
      getValue(val) {
        return this.$emit('input', val);
      }
    },
    mounted() {
      this.setInput(this.value);
    },
    methods: {
      setInput(val) {
        this.input = val;
      }
    }
  }
</script>
