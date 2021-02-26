<template>
  <div>
    <wysiwyg v-model="editor" :placeholder="$t('write')"/>
  </div>
</template>
<i18n>
  {
  "en":{
  "write":"write here"
  },
  "fa":{
  "write": "بنویسید"
  }
  }
</i18n>
<script>
  import "vue-wysiwyg/dist/vueWysiwyg.css";

  export default {
    props: ['value', 'label'],
    data() {
      return {
        editor: null,
      }
    },
    computed: {
      content() {
        return this.editor;
      }
    },
    watch: {
      value(val) {
        this.editor = val;
      },
      content(val) {
        this.$emit('input', this.content);
      }
    },
    methods: {
      startEditor() {
        this.editor = this.value;
      },
    },
    mounted() {
      this.startEditor();
    },
    beforeDestroy() {
    }
  }
</script>
