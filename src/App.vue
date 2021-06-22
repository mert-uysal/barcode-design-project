<template>
  <div id="app">
    <router-link to="/" tag="a" class="link">Anasayfa</router-link>
    <router-link to="/about" tag="a" class="link">Hakkında</router-link>
    <router-link to="/helloworld" tag="a" class="link">Vue Introduction</router-link>
    <router-link to="/barcode" tag="a" class="link">Barkod</router-link>
    <router-link to="/test" tag="a" class="link">Test</router-link>
    <hr/>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.link {
  border: 1px solid #000;
  border-radius: 10px;
  padding: 5px;
  text-decoration: none;
}
</style>
