<template>
  <b-button size="sm"
    v-if="!isCharging"
    :disabled="pig.state === pigstate.DEAD"
    @click="() => pig.state === pigstate.LISTENING ? interrupt() : talk()">
      <font-awesome-icon :icon="pig.state === pigstate.LISTENING ? $icon.faBan : $icon.faComment" />
  </b-button>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

@Component
export default class GiftButton extends Vue {
  @Getter pig
  @Action interrupt
  @Action talk
}
</script>
