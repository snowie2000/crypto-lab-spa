<template>
  <div>
    <editor id="jsonEditor" ref="aceContainer" v-model="jsonText" @init="editorInit" lang="json" theme="github" width="100%" :height="aceHeight" :options="aceOptions"></editor>
    <div class="text-centered" style="margin-top: 10px">
      <el-button @click="prettyit" type="primary">Pretty Print</el-button>
    </div>
  </div>
</template>

<script>
import prettier from "json-stringify-pretty-compact"
import editor from "vue2-ace-editor"
import {ResizeSensor} from "css-element-queries"

export default {
  name: "CJson",
  components: {
    editor
  },
  data: function () {
    return {
      jsonText: "",
      aceHeight: "550px",
      aceOptions: {
        wrap: true,
      }
    }
  },
  methods: {
    editorInit: function (edt) {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/json')    //language
      require('brace/theme/github')
      require('brace/snippets/json') //snippet
      new ResizeSensor(this.$refs.aceContainer.$el, ()=>{
        edt.resize()
      })
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
    max-height: 80vh;
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