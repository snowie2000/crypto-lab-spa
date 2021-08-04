<template>
  <div>
    <el-input type="textarea" class="ele" rows="10" placeholder="Input text" v-model="text" spellcheck="false" autocomplete="off"></el-input>
    <div class="text-centered" id="op-row">
      <el-select v-model="encodetype" style="width: 110px; padding-right: 10px">
        <el-option value=1 label="Standard"></el-option>
        <el-option value=2 label="URLSafe"></el-option>
      </el-select>
      <el-button type="primary" @click="encodeText">Encode</el-button>
      <el-button type="secondary" @click="decodeText">Decode</el-button>
    </div>
    <div>
      <div id="output-left"><el-input type="textarea" class="ele"  rows="10" placeholder="Processed text goes here" :value="output"></el-input></div>
      <div id="output-right"><el-input type="textarea" class="ele" rows="10" placeholder="Processed binary goes here" :value="binOutput"></el-input></div>
    </div>
  </div>
</template>

<script>
import base64 from "crypto-js/enc-base64"
import utf8 from "crypto-js/enc-utf8"
import latin1 from "crypto-js/enc-latin1"
import hex from "crypto-js/enc-hex"

export default {
  name: "CBase64",
  methods: {
    beautifyHex(hex) {
      hex = hex.replaceAll(/(..)/g, "$1 ")
      hex = hex.replaceAll(/((..\s){8})/g, "$1 ")
      hex = hex.replaceAll(/((..\s+){16})/g, "$1\r\n").toUpperCase()
      return hex
    },
    encodeText() {
      let ptext = null
      try {
        try {
          ptext = utf8.parse(this.text)
        } catch {
          ptext = latin1.parse(this.text)
        }
        if (this.encodetype === "1") {
          this.output = base64.stringify(ptext)
        } else {
          this.output = base64.stringify(ptext).replaceAll("+", "-").replaceAll("/", "_")
        }
      } catch (e) {
        this.$message({
          message: e.message,
          type: "warning"
        })
      }
    },
    decodeText() {
      let binary
      try {
        if (this.encodetype === "1") {
          binary = base64.parse(this.text)
        } else {
          binary = base64.parse(this.text.replaceAll("-", "+").replaceAll("_", "/"))
        }
        this.binOutput = this.beautifyHex(hex.stringify(binary))
        try {
          this.output = utf8.stringify(binary)
        } catch {
          this.output = latin1.stringify(binary)
        }
      } catch (e) {
        this.$message({
          message: e.message,
          type: "warning"
        })
      }
    }
  },
  data: function() {
    return {
      encodetype: "1",
      text: "",
      output: "",
      binOutput: ""
    }
  }
}
</script>

<style scoped lang="less">
  #op-row {
    margin: 10px 0;
  }

  /deep/ #output-right {
    display: inline-block;
    width: 50%;
    vertical-align: top;
    @media screen and (max-width: 900px) {
      margin-top: 10px;
      width: 100%;
    }
  }
  /deep/ #output-left {
    display: inline-block;
    width: calc(50% - 10px);
    margin-right: 10px;
    @media screen and (max-width: 900px) {
      width: 100%;
    }
  }
</style>