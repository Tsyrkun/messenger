<template>
  <transition name="fade-transition" mode="out-in">
    <router-view />
  </transition>
</template>

<script>
    export default {
        name: 'Root',
    }
</script>

<style lang="stylus">
  /*@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');*/
  /* Global CSS */

  html, body
    height: 100%
    overflow: hidden!important

  #app
    height 100%
    display flex!important
</style>
