<template>
  <div id="app">
    <DayNightCss />
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class App extends Vue {
}
</script>
