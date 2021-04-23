<template>
  <div id="app">
    <el-tabs :value="activeName" @tab-click="switchTable" ref="tab">
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
      activeName: "base64",
      tabDrag: {
        touchX: 0,
        offsetStart: 0,
        tablist: null,
        maxShift: 0,
      }
    }
  },
  methods: {
    switchTable(tab) {
      if (this.$route.name !== tab.name) {
        this.$router.push({
          name: tab.name
        })
      }
    },
    touchstart(e) {
      this.tabDrag.touchX = e.touches[0].clientX
      this.tabDrag.tablist = this.$refs.tab.$el.querySelector("div[role=tablist]")
      this.tabDrag.maxShift = this.tabDrag.tablist.clientWidth - this.tabDrag.tablist.parentElement.clientWidth
      this.tabDrag.offsetStart = this.tabDrag.tablist.parentElement.getBoundingClientRect().x - this.tabDrag.tablist.getBoundingClientRect().x
    },
    touchmove(e) {
      let delta = this.tabDrag.touchX - e.touches[0].clientX
      if (delta > 10 || delta< -10) {
        this.tabDrag.tablist.classList.add("dragging")
        // this.tabDrag.tablist.style["transform"] = "translateX(" + (this.tabDrag.offsetStart + delta) + "px)"
        let offset = this.tabDrag.offsetStart + delta
        offset = offset<0?0:(offset>this.maxShift?this.maxShift:offset)
        this.$refs.tab.$children[0].$data.navOffset = offset
      }
    },
    touchend() {
      if (this.tabDrag.tablist.classList.contains("dragging")) {
        this.tabDrag.tablist.classList.remove("dragging")
      }
    }
  },
  created() {
    this.$router.afterEach((to)=>{
      this.activeName = to.name
    })
  },
  mounted() {
    this.activeName = this.$route.name;
    ["touchstart", "touchmove", "touchend"].forEach(v=> {
      this.$refs.tab.$el.addEventListener(v, (e) => {
        this[v](e)
      })
    })
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

.el-tabs__nav.dragging {
  transition: none;
}

.text-centered {
  text-align: center;
}
</style>
