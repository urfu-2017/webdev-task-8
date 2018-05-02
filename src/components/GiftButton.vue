<template>
  <b-button size="sm"
    v-if="!isCharging"
    :disabled="pig.state === pigstate.DEAD"
    @click="() => pig.state === pigstate.EATING ? interrupt() : feed()">
      <font-awesome-icon :icon="pig.state === pigstate.EATING ? $icon.faBan : $icon.faGift" />
  </b-button>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'


@Component
export default class GiftButton extends Vue {
  isCharging = false
  @Getter pig
  @Action interrupt
  @Action feed

  onChargingChanged(isCharging) {
    this.isCharging = isCharging
    if (isCharging) {
      this.feed()
    } else {
      this.interrupt()
    }
  }

  created() {
    const battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery
    if (battery) {
      this.onChargingChanged(battery.charging)
      battery.addEventListener('chargingchange',
        () => this.onChargingChanged(battery.charging), false)
    }
  }
}
</script>
