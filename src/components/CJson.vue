<template>
  <div>
    <el-input type="textarea" :autosize="{minRows: 20, maxRows: 30}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
              v-model="jsonText" placeholder="Input your json"></el-input>
    <div class="text-centered" style="margin-top: 10px">
      <el-button @click="prettyit" type="primary">Pretty Print</el-button>
    </div>
  </div>
</template>

<script>
import prettier from "json-stringify-pretty-compact"

export default {
  name: "CJson",
  data: function () {
    return {
      jsonText: ""
    }
  },
  methods: {
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

<style scoped>

</style>