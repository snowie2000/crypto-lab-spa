<template>
  <div>
    <div>
      <el-button icon="el-icon-finished" @click="mode.casesensitive=!mode.casesensitive; compileRegexp()"
                 :class="{ 'el-button--primary': mode.casesensitive }">Case sensitive
      </el-button>
      <el-button icon="el-icon-s-unfold" @click="mode.multiline=!mode.multiline"
                 :class="{ 'el-button--primary': mode.multiline }">Multiline
      </el-button>
      <el-button icon="el-icon-caret-right" @click="DoReplace" type="success" plain>Replace
      </el-button>
    </div>
    <div class="row">
      <transition name="collapse">
        <div class="alertbox" v-if="error.message!==''">
          <el-alert :closable="false" type="error" :title="error.message"></el-alert>
        </div>
      </transition>
      <el-input type="text" placeholder="Input regex expression" v-model="exp" @input="compileRegexp"></el-input>
    </div>
    <div class="row">
      <el-input type="text" placeholder="Replace to" v-model="replacer" @change="replacerChange"></el-input>
    </div>
    <div class="row">
      <div class="container">
        <div class="backdrop" ref="hlBg">
          <div class="highlights" v-html="hlText">
            <!-- cloned text with <mark> tags here -->
          </div>
        </div>
        <!-- user input here -->
        <el-tooltip placement="top" :manual="true" content="Text is empty" :value="error.text">
          <textarea class="ele" id="sourceText" ref="rptext" placeholder="Source text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                    @input.passive="handleInput" @scroll.passive="handleScroll">
          </textarea>
        </el-tooltip>
      </div>
    </div>
    <!--    place for replaced text-->
    <div class="row" v-if="replacedText.length">
      <textarea class="ele" id="replacedText" rows="20" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Replaced text"
                v-model="replacedText"></textarea>
    </div>
    <el-table
        v-if="matchResult.result.length>0"
        :data="matchResult.result"
        height="250"
        border
        style="width: 100%">
      <el-table-column
          prop="seq"
          label="No"
          width="50">
      </el-table-column>
      <el-table-column v-for="(column, index) in matchResult.columns" :key="column" :prop="column"
                       :label="index.toString()">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import tool from "@/tools/common"
export default {
  name: "CRegex",
  methods: {
    compileRegexp: tool.debounce(function() {
      if (this.exp.length) {
        try {
          this.regexp = new RegExp(this.exp, "g" + (this.mode.multiline ? "m" : "") + (this.mode.casesensitive ? "" : "i"))
          if (this.text.length)
            this.matchText()
          this.error.message = ""
        } catch (e) {
          this.error.message = e.message
        }
      }
      else {
        this.regexp = null
        this.error.message = ""
      }
    }, 500),
    replacerChange() {
      if (!this.replacer.length) {
        this.replacedText = ""
      }
    },
    DoReplace() {
      this.replacedText = ""
      if (!this.exp.length) {
        return
      }
      if (!this.text.length) {
        return
      }
      this.replacedText = this.text.replaceAll(this.regexp, this.replacer.replaceAll("\\r", "\r").replaceAll("\\n", "\n").replaceAll("\\t", "\t"))
    },
    matchText: tool.debounce(function() {
        if (!this.regexp) return
        let matches = [...this.text.matchAll(this.regexp)]
        this.matchResult.columns = []
        this.matchResult.result = []
        let count = 0
        for (let i=0; i<matches.length && i<2000; ++i) {
          let v = matches[i]
          if (v.length > count)
            count = v.length  // get maximum column count
          let item = {seq: i + 1, index: v.index, length: v[0].length}
          for (let j = 0; j < v.length; ++j) {
            item["catch" + j] = v[j]
          }
          this.matchResult.result.push(item)
        }
        for (let i = 0; i < count; ++i) { // create table columns
          this.matchResult.columns.push("catch" + i)
        }
        this.hlText = this.highlightText(this.text)
      }, 300)
    ,
    sanitize(text) {
      let div = document.createElement("div")
      div.textContent = text
      let sanitizedText = div.innerHTML
      div.remove()
      return sanitizedText
    },
    highlightText(plaintext) {
      plaintext = plaintext.replace("\x01", "").replace("\x02", "")
      for (let i = this.matchResult.result.length - 1; i >= 0; --i) {
        plaintext = plaintext.splice(this.matchResult.result[i].index, "\x01")
        plaintext = plaintext.splice(this.matchResult.result[i].index + this.matchResult.result[i].length + 1, "\x02")
      }
      plaintext = this.sanitize(plaintext)
      plaintext = plaintext
          // eslint-disable-next-line no-control-regex
          .replaceAll(/\x01(.+?)\x02/msg, "<mark>$1</mark>").replace(/\n$/g, '\n\n')
      return plaintext
    },
    handleInput() {
      this.text = this.$refs.rptext.value
      this.hlText = this.sanitize(this.text).replace(/\n$/g, '\n\n')
      this.matchText()
    },
    handleScroll() {
      this.$refs.hlBg.scrollTop = this.$refs.rptext.scrollTop
    }
  },
  created() {
    if (String.prototype.splice === undefined) {
      /**
       * Splices text within a string.
       * @param {int} offset The position to insert the text at (before)
       * @param {string} text The text to insert
       * @param {int} [removeCount=0] An optional number of characters to overwrite
       * @returns {string} A modified string containing the spliced text.
       */
      String.prototype.splice = function(offset, text, removeCount=0) {
        let calculatedOffset = offset < 0 ? this.length + offset : offset;
        return this.substring(0, calculatedOffset) +
            text + this.substring(calculatedOffset + removeCount);
      };
    }
  },
  data: function () {
    return {
      exp: "",
      regexp: null,
      replacer: "",
      text: "",
      replacedText: "",
      hlText: "",
      error: {
        message: ""
      },
      mode: {
        casesensitive: true,
        multiline: false,
        replace: false,
      },
      matchResult: {
        result: [],
        columns: []
      }
    }
  }
}
</script>

<style scoped lang="less">
.row {
  margin: 10px 0;
}
.backdrop {
  overflow: auto;
  position: absolute;
  top: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}
textarea {
  background: transparent !important;
  font-family: Monospaced, Consolas, monospace;
  font-size: 13px;
}
.container {
  display: block;
  position: relative;
  height: 300px;
  -webkit-text-size-adjust: none;
}
.highlights {
// mimic ele textarea
  display: block;
  padding: 5px 15px;
  line-height: 1.5;
  border: 1px solid transparent;

  color: transparent;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: Monospaced, Consolas, monospace;
  font-size: 13px;
  margin: 0;
  /deep/ mark {
    color: transparent;
    border: 1px solid darken(#d4e9ab, 10%);
    margin: -1px;
    border-radius: 3px;
    background-color: #d4e9ab; /* or whatever */
  }
}
#sourceText {
  z-index: 10;
  position: relative;
  width: 100%;
  height: 300px;
  margin: 0;
  resize: none;
}

#replacedText {
  resize: vertical;
}

.alertbox {
  height: 45px;
}
.collapse-enter, .collapse-leave-to {
  height: 0;
}
.collapse-enter-active, .collapse-leave-active {
  transition: height .3s ease;
}
</style>