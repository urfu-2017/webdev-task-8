<template>
  <main>
    <Pig class="pig-container" />
  </main>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Main extends Vue {
}
</script>

<style scoped>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pig-container {
    max-width: 450px;
    width: 100%;
    height: 100vh;
    max-height: 310px;
  }
</style>
