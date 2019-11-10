<template>
  <div>
    <div ref="editor" style="text-align:left" @change="$emit('balabala', $event.target.checked)"></div>
    <button v-on:click="getContent">查看内容</button>
  </div>
</template>

<script>
  import E from 'wangeditor'

  export default {
    name: 'editor',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        editorContent: this.value
      }
    },
    methods: {
      getContent: function () {
        alert(this.editorContent)
        this.$emit('input', this.editorContent);
      }
    },
    mounted() {
      var editor = new E(this.$refs.editor)
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.$emit('input', this.editorContent);
      }
      editor.create()
      editor.txt.html(this.editorContent)
    }
  }
</script>

<style scoped>
</style>
