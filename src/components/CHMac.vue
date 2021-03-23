<template>
  <div id="hmacform">
      <div class="row">
      <label>Secret: <input type="text" v-model="secret" @input="updateHash"
                                                           style="margin-right: 20px"></label>
      </div>
      <div class="row">
      <label>Algorithm:
        <el-select @change="updateHash" v-model="hashmethod">
          <el-option v-for="name in algorithm" :key="name" :value="name"></el-option>
        </el-select>
      </label>
      </div>
    <div>HMAC for text: <span id="output">{{ hmacHex }}</span></div>
    <el-input type="textarea" style="padding: 10px 0" @input="hashText" :autosize="{minRows: 20, maxRows: 30}"
              placeholder="Type to get HMAC" autocomplete="off" autocorrect="off" autocapitalize="off"
              spellcheck="false" v-model="hmacText"></el-input>
    <div>
      <span>HMAC for file: </span>
      <input type="file" @change="hashFile" ref="fileinput" style="visibility: hidden; width: 0; height: 0">
      <el-button type="info" plain @click="openFile">Select a file</el-button>
      <ul class="hashlist">
        <li v-for="(item, index) in hashlist" :key="index">
          <span class="filename">{{ item.filename }}</span><span class="filehash">{{ item.hash }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import hex from "crypto-js/enc-hex";
import hmacMd5 from "crypto-js/hmac-md5"
import hmacSha1 from "crypto-js/hmac-sha1"
import hmacSha256 from "crypto-js/hmac-sha256"
import hmacSha224 from "crypto-js/hmac-sha224"
import hmacSha3 from "crypto-js/hmac-sha3"
import hmacSha384 from "crypto-js/hmac-sha384"
import hmacSha512 from "crypto-js/hmac-sha512"
import hmacRipe from "crypto-js/hmac-ripemd160"
import latin1 from "crypto-js/enc-latin1";
import tool from "@/tools/common";
import utf8 from "crypto-js/enc-utf8";

export default {
  name: "CHMac",
  data: function () {
    return {
      hmacHex: "",
      hmacText: "",
      secret: "",
      hashmethod: "SHA1",
      algorithm: [
        "SHA1",
        "SHA3",
        "SHA224",
        "SHA256",
        "SHA384",
        "SHA512",
        "MD5",
        "Ripemd160"
      ],
      hashlist: []
    }
  },
  methods: {
    updateHash() {
      this.hashText()
    },
    openFile() {
      this.$refs.fileinput.click()
    },
    getDigestMethod() {
      switch (this.hashmethod) {
        case "MD5": {
          return hmacMd5
        }
        case "SHA256": {
          return hmacSha256
        }
        case "SHA3": {
          return hmacSha3
        }
        case "SHA224": {
          return hmacSha224
        }
        case "SHA384": {
          return hmacSha384
        }
        case "SHA512": {
          return hmacSha512
        }
        case "Ripemd160": {
          return hmacRipe
        }
        case "SHA1":
        default: {
          return hmacSha1
        }
      }
    },
    hashFile(e) {
      if (this.secret.trim() === "") {
        return
      }
      let reader = new FileReader()
      let binary;
      let result = {
        filename: e.target.files[0].name,
      }
      reader.onloadend = () => {
        binary = (reader.result);
        result.hash = hex.stringify(this.getDigestMethod()(latin1.parse(binary), this.secret))
        this.hashlist.push(result)
      }

      reader.readAsBinaryString(e.target.files[0]);
    },
    hashText: tool.debounce(function () {
      if (this.secret.trim() === "")
        this.hmacHex = "Secret can't be empty"
      else {
        this.hmacHex = hex.stringify(this.getDigestMethod()(utf8.parse(this.hmacText), this.secret))
      }
      // this.md5Hex = hex.stringify(md5(utf8.parse(text)))
    }, 250)
  }
}
</script>

<style scoped lang="less">
.row {
  margin-bottom: 10px;
  display: inline-block;
}

#hmacform {
  color: #606266;
  font-size: 14px;
}

#output {
  text-transform: uppercase;
  word-break: break-word;
}

.hashlist {
  list-style-type: none;
  line-height: 25px;
  padding-left: 5px;

  .filename {
    display: inline-block;
    width: 50%;
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
    word-break: break-word;
    font-family: Monospaced, monospace, Consolas;
  }
}

input[type=text] {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 32px;
  line-height: 32px;
  outline: none;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);

  &:focus {
    outline: none;
    border-color: #409eff;
  }
}
</style>