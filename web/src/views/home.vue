<template>
  <div class="container">
    <headTop></headTop>
    <el-row class="tac" style="height: 100vh">
      <el-col :span="12" style="height: 100vh; width: 15%">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          style="height: 100vh"
        >
          <el-menu-item index="ID3">
            <i class="el-icon-caret-top"></i>
            <span slot="title">决策树</span>
          </el-menu-item>
          <el-menu-item index="Kmeans">
            <i class="el-icon-caret-bottom"></i>
            <span slot="title">K-means聚类</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%; overflow: auto; width: 85%">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import headTop from '../components/headTop'

export default {
  methods: {},
  computed: {
    defaultActive: function () {
      return this.$route.path.replace('/', '')
    }
  },
  components: {
    headTop
  }
}
</script>
<style>
</style>
<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
