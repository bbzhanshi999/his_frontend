<template>
  <div id="app">
    <transition appear
                appear-active-class="animated zoomInUp"
                name="custom-classes-transition" enter-active-class="animated zoomInUp"
                mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  font-size: 1rem;
  overflow: hidden;
}
* {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
html,#app,div.container{
  height:100% ;
}
body{
  font-size: 62.5%;
  height: 100%;
  margin: 0;
}
</style>
