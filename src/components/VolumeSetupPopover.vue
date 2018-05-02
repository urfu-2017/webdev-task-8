<template>
  <b-popover :target="targetId" triggers="focus">
    <b-form-input v-model="volumeLevel" min="0" max="100" type="number"></b-form-input>
  </b-popover>
</template>

<script>
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

@Component
export default class VolumeSetupPopover extends Vue {
  get volumeLevel() {
    return this.state.volumeLevel
  }

  set volumeLevel(value) {
    this.setVolumeLevel(value)
  }

  @Prop() targetId
  @Getter state
  @Action setVolumeLevel
}
</script>