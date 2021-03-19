<template>
  <div>
    <textarea class="ele" rows="10" placeholder="Input text" v-model="text" spellcheck="false" autocomplete="off"></textarea>
    <div class="text-centered" id="op-row">
      <el-select v-model="encodetype" style="width: 110px; padding-right: 10px">
        <el-option value=1 label="Standard"></el-option>
        <el-option value=2 label="URLSafe"></el-option>
      </el-select>
      <el-button type="primary" @click="encodeText">Encode</el-button>
      <el-button type="secondary" @click="decodeText">Decode</el-button>
    </div>
    <div>
      <textarea id="output-left" class="ele"  rows="10" placeholder="Processed text goes here" :value="output" readonly></textarea>
      <textarea id="output-right" class="ele" rows="10" placeholder="Processed binary goes here" :value="binOutput" readonly></textarea>
    </div>
  </div>
</template>

<script>
import base64 from "crypto-js/enc-base64"
import utf8 from "crypto-js/enc-utf8"
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
      if (this.encodetype === "1") {
        this.output = base64.stringify(utf8.parse(this.text))
      } else {
        this.output = base64.stringify(utf8.parse(this.text)).replaceAll("+", "-").replaceAll("/", "_")
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
        this.output = utf8.stringify(binary)
        this.binOutput = this.beautifyHex(hex.stringify(binary))
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
    margin: 20px 0 10px 0;
  }
  textarea {
    margin-top: 10px;
  }
  @media screen and (min-width: 900px) {
    #output-right {
      display: inline-block;
      width: 50%;
      vertical-align: top;
    }
    #output-left {
      display: inline-block;
      width: calc(50% - 10px);
      margin-right: 10px;
    }
  }
</style>