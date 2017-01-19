<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/list">The list</router-link>
    </nav>
    <img src="./assets/logo.svg">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {}
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  a.router-link-active {
    font-weight: bold;
  }
}
</style>
