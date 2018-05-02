<template>
  <div>
    <pre style="background: #">State:
    isNight: {{isNight}}, needsAttention: {{needsAttention}}
    {{JSON.stringify(state, null, 2)}}
    </pre>
    <button @click="restart">Restart</button>
    <button @click="cradle">Cradle</button>
    <button @click="interrupt">Interrupt</button>
    <button @click="feed">Feed</button>
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

@Component
export default class Pig extends Vue {
  @Getter state
  @Getter pig
  @Getter isNight
  @Getter needsAttention

  @Action restart
  @Action cradle
  @Action interrupt
  @Action feed
}
</script>

<style scoped>
  pre {
    background: #eee;
    padding: 1em;
  }
</style>
