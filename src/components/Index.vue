<template>
  <div class="container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
             background-color="#545c64"
             text-color="#fff"
             :router="true"
             active-text-color="#ffd04b">
      <el-menu-item index="/index/charge">
        <i class="el-icon-edit"></i>
        <span slot="title">门诊收费</span>
      </el-menu-item>
      <el-menu-item index="/index/restore">
        <i class="el-icon-remove"></i>
        <span slot="title">门诊退费</span>
      </el-menu-item>
      <el-menu-item index="/index/search">
        <i class="el-icon-tickets"></i>
        <span slot="title">收费查询</span>
      </el-menu-item>
    </el-menu>
    <transition appear
                appear-active-class="animated fadeInRightBig"
                name="custom-classes-transition" enter-active-class="animated  fadeInRightBig"
                mode="out-in">
    <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'Index',
  data () {
    return {
      activeIndex: '/index/charge'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style scoped>
</style>
