<template>
  <div>
    <wysiwyg v-model="editor" :placeholder="'بنویسید'"/>
  </div>
</template>
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
      // Always destroy your editor instance when it's no longer needed

    },
    components: {},
  }
</script>
