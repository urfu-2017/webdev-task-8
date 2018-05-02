<template>
  <div>
    <div class="pig">
      <div class="pig-phrases">
        <PigSpeech />
      </div>

      <div class="pig-avatar">
        <div class="svg" :class="svgFrame"></div>
      </div>

      <div class="pig-bars">
        <b-progress v-b-tooltip.hover title="Сытость" variant="info" class="mb-2"
          :value="pig.fat" show-progress />
        <b-progress v-b-tooltip.hover title="Энергия" variant="warning" class="mb-2"
          :value="pig.energy" show-progress />
        <b-progress v-b-tooltip.hover title="Настроение" variant="danger" class="mb-2"
          :value="pig.mood" show-progress />
          <b-button-group>
            <b-button variant="outline-secondary" size="sm" @click="restart">
              <font-awesome-icon :icon="$icon.faRedo" />
            </b-button>
            <b-button variant="outline-secondary" size="sm" id="setupVolume">
              <font-awesome-icon :icon="state.volumeLevel > 30 ? $icon.faVolumeUp :
                state.volumeLevel ? $icon.faVolumeDown : $icon.faVolumeOff" />
            </b-button>
            <GiftButton />
            <SpeakButton />
          </b-button-group>
        <VolumeSetupPopover targetId="setupVolume" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import Visibility from 'visibilityjs'
import _ from 'lodash'
import pigstate from '../pigstate'


@Component
export default class Pig extends Vue {
  svgFrame = 'idle0'

  @Getter state
  @Getter pig
  @Getter isNight
  @Getter needsAttention

  @Action restart
  @Action cradle
  @Action interrupt
  @Action feed

  created() {
    if (!Visibility.hidden()) {
      this.interrupt()
    }

    setInterval(() => {
      this.svgFrame = this.pig.state === pigstate.DEAD ? 'dead' : `idle${_.random(3)}`
    }, 500)

    Visibility.change(() => {
      if (Visibility.hidden()) {
        this.cradle()
      } else {
        this.interrupt()
      }
    })
  }
}
</script>

<style scoped>
  .pig {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: 30% 5% auto;
    grid-template-rows: 30% auto;
    grid-template-areas:
      "pig-phrases . pig-avatar"
      "pig-bars    . pig-avatar";
  }

  .pig-bars {
    grid-area: pig-bars;
  }

  .pig-avatar {
    grid-area: pig-avatar;
  }

  .pig-phrases {
    grid-area: pig-phrases;
    text-align: right;
  }

  .dead {
    background-image: url('../assets/dead.svg');
  }

  .idle0 {
    background-image: url('../assets/idle0.svg');
  }

  .idle1 {
    background-image: url('../assets/idle1.svg');
  }

  .idle2 {
    background-image: url('../assets/idle2.svg');
  }

  .idle3 {
    background-image: url('../assets/idle3.svg');
  }

  .svg {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>
