<template>
  <div id="md5form">
    <div>MD5 for text: <span id="output">{{ md5Hex }}</span></div>
    <el-input type="textarea" style="padding: 10px 0" @input="hashText" :autosize="{minRows: 20, maxRows: 30}" placeholder="Type to get MD5 hash" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" v-model="md5Text"></el-input>

    <div>
      <span>MD5 for file: </span>
      <input type="file" @change="hashFile" ref="fileinput" style="visibility: hidden; width: 0; height: 0"><el-button type="info" plain @click="openFile">Select a file</el-button>
      <ul class="hashlist">
        <li v-for="(item, index) in hashlist" :key="index">
          <span class="filename">{{ item.filename }}</span><span class="filehash">{{ item.hash }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import utf8 from "crypto-js/enc-utf8"
import latin1 from "crypto-js/enc-latin1"
import md5 from "crypto-js/md5"
import hex from "crypto-js/enc-hex"
import tool from "@/tools/common"

export default {
  name: "CMD5",
  data: function () {
    return {
      md5Text: "",
      md5Hex: "",
      hashlist: []
    }
  },
  methods: {
    openFile() {
      this.$refs.fileinput.click()
    },
    hashFile(e) {
      let reader = new FileReader()
      let binary;
      let result = {
        filename: e.target.files[0].name,
      }
      reader.onloadend = () =>{
        binary = (reader.result);
        result.hash = hex.stringify(md5(latin1.parse(binary)))
        this.hashlist.push(result)
      }

      reader.readAsBinaryString(e.target.files[0]);
    },
    hashText: tool.debounce(function (text) {
      this.md5Hex = hex.stringify(md5(utf8.parse(text)))
    }, 250)
  }
}
</script>

<style scoped lang="less">
  #md5form {
    color: #606266;
    font-size: 14px;
  }
  #output {
    text-transform: uppercase;
  }
  .hashlist {
    list-style-type: none;
    line-height: 25px;
    padding-left: 5px;
    .filename {
      display: inline-block;
      width: 80%;
      max-width: 300px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      vertical-align: middle;
    }
    .filehash {
      display: inline-block;
      vertical-align: middle;
      text-transform: uppercase;
      font-family: Monospaced,monospace,Consolas;
    }
  }
</style>