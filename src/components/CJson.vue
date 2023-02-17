<template>
  <div>
    <editor id="jsonEditor" ref="aceContainer" v-model="jsonText" @init="editorInit" lang="json" theme="github"
      width="100%" :height="aceHeight" :options="aceOptions"></editor>
    <div class="text-centered" style="margin-top: 10px">
      <el-button @click="prettyit" type="primary">Pretty Print</el-button>
      <el-button @click="prettyclip" type="primary">Paste from clipboard</el-button>
    </div>
  </div>
</template>

<script>
import prettier from "json-stringify-pretty-compact"
import editor from "vue2-ace-editor"
import { ResizeSensor } from "css-element-queries"
import "brace/ext/language_tools" //language extension prerequsite...
import "brace/mode/json" //language
import "brace/theme/github"
import "brace/ext/searchbox"
import "brace/snippets/json" //snippet
import jsonlint from "@/lib/jsonlint"

// interface JsonLintError {
//   expected: string[];
//   line: number;
//   loc: {
//     first_line: number,
//     last_line: number,
//     first_column: number,
//     last_column: number,
//   };
//   text: string;
//   token: string;
// }

export default {
  name: "CJson",
  components: {
    editor,
  },
  data: function () {
    return {
      mounted: false,
      jsonText: "",
      resizer: null,
      aceHeight: "550px",
      aceOptions: {
        wrap: true,
      },
    }
  },
  methods: {
    editorInit: function () {},
    prettyclip() {
      navigator.clipboard.readText().then((text) => {
        try {
          let obj = JSON.parse(text)
          this.jsonText = prettier(obj)
        } catch (e) {
          this.$message({
            message: "<pre>" + e.message + "</pre>",
            dangerouslyUseHTMLString: true,
            type: "warning",
          })
        }
      })
    },
    prettyit() {
      try {
        let obj = JSON.parse(this.jsonText)
        this.jsonText = prettier(obj)
      } catch (e) {
        this.$message({
          message: "<pre>" + e.message + "</pre>",
          dangerouslyUseHTMLString: true,
          type: "warning",
        })

        // standard browser parser exception handling
        let pos = e.message.match(/position\s*(\d+)/i) //chrome exception parser first
        let ace = this.$refs.aceContainer.editor
        let textpos = null
        if (pos && pos.length === 2) {
          textpos = ace.session.doc.indexToPosition(pos[1])
        } else {
          pos = e.message.match(/line\s*(\d+)\s*column\s*(\d+)/i) //firefox exception
          if (pos && pos.length === 3) {
            textpos = {
              row: parseInt(pos[1]) - 1,
              column: parseInt(pos[2]) - 1,
            }
          }
        }

        // no match from browser exception, we use jsonlint to check json for errors.
        if (!textpos) {
          try {
            jsonlint.parse(this.jsonText)
          } catch (e) {
            textpos = {
              row: e.cause.loc.last_line - 1,
              column: e.cause.loc.last_column,
            }
          }
        }
        // move cursor to the error position
        if (textpos) {
          ace.moveCursorToPosition(textpos)
          ace.clearSelection()
          ace.renderer.scrollCursorIntoView(textpos, 0.5)
          ace.focus()
        }
      }
    },
  },
  mounted() {
    this.mounted = true
    if (!this.resizer) {
      this.resizer = new ResizeSensor(this.$refs.aceContainer.$el, () => {
        this.$refs.aceContainer.editor.resize()
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.mounted) {
        vm.resizer = new ResizeSensor(vm.$refs.aceContainer.$el, () => {
          vm.$refs.aceContainer.editor.resize()
        })
      }
      return true
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.resizer) {
      this.resizer.detach()
      this.resizer = null
    }
    next(true)
  },
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
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  &:hover {
    border-color: #c0c4cc;
  }
  &:focus {
    outline: 0;
    border-color: #409eff;
  }
}
</style>

<style>
pre {
  margin: 0;
}
</style>