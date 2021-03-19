<template>
  <div id="app">
    <el-tabs :value="activeName" @tab-click="switchTable">
      <el-tab-pane v-for="label in ['base64', 'md5', 'json', 'hmac', 'regex']" :key="label" :label="label.toUpperCase()" :name="label"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

import "@/config/config.Element"

export default {
  name: 'App',
  data: function () {
    return {
      activeName: "base64"
    }
  },
  methods: {
    switchTable(tab) {
      if (this.$route.name !== tab.name) {
        this.$router.push({
          name: tab.name
        })
      }
    }
  },
  created() {
    this.$router.afterEach((to)=>{
      this.activeName = to.name
    })
  },
  mounted() {
    this.activeName = this.$route.name
  }
}
</script>

<style lang="less">
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 90%;
  margin: 0 auto;
  text-align: left;
}

textarea.ele {
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

.text-centered {
  text-align: center;
}
</style>
