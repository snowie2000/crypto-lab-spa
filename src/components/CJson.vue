<template>
  <div>
    <editor id="jsonEditor" v-model="jsonText" @init="editorInit" lang="json" theme="chrome" width="100%" height="550"></editor>
    <div class="text-centered" style="margin-top: 10px">
      <el-button @click="prettyit" type="primary">Pretty Print</el-button>
    </div>
  </div>
</template>

<script>
import prettier from "json-stringify-pretty-compact"

export default {
  name: "CJson",
  components: {
    editor: require("vue2-ace-editor")
  },
  data: function () {
    return {
      jsonText: ""
    }
  },
  methods: {
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/json')    //language
      require('brace/theme/chrome')
      require('brace/snippets/javascript') //snippet
    },
    prettyit() {
      try {
        let obj = JSON.parse(this.jsonText)
        this.jsonText = prettier(obj)
      } catch (e) {
        this.$message({
          message: e.message,
          type: "warning"
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
  #jsonEditor {
    display: block;
    padding: 5px 15px;
    line-height: 1.5;
    box-sizing: border-box;
    width: 100%;
    font-size: 13px;
    color: #606266;
    resize: vertical;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    &:hover {
       border-color: #C0C4CC;
     }
    &:focus {
       outline: 0;
       border-color: #409EFF;
     }
  }
</style>