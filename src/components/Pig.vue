<template>
  <div>
    <div class="pig">
      <div class="pig-phrases">
        phrases
      </div>

      <div class="pig-avatar">
        <pre>{{JSON.stringify(state, null, 2)}}</pre>
      </div>

      <div class="pig-bars">
        <b-progress v-b-tooltip.hover title="Сытость" variant="info" class="mb-2" :value="pig.fat" show-progress></b-progress>
        <b-progress v-b-tooltip.hover title="Энергия" variant="warning" class="mb-2" :value="pig.energy" show-progress></b-progress>
        <b-progress v-b-tooltip.hover title="Настроение" variant="danger" class="mb-2" :value="pig.mood" show-progress></b-progress>
        <b-container fluid>
          <b-button-group>
            <b-button size="sm" @click="restart">
              <font-awesome-icon :icon="$icon.faRedo" />
            </b-button>
            <b-button size="sm" id="setupVolume">
              <font-awesome-icon :icon="state.volumeLevel > 30 ? $icon.faVolumeUp : $icon.faVolumeDown" />
            </b-button>
            <b-button size="sm" @click="() => pig.state === 'eating' ? interrupt() : feed()">
              <font-awesome-icon :icon="pig.state === 'eating' ? $icon.faBan : $icon.faGift" />
            </b-button>
          </b-button-group>
        </b-container>
        <VolumeSetupPopover targetId="setupVolume" />
      </div>
    </div>
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
  .pig {
    display: grid;
    background: red;
    width: 100%;
    height: 100%;
    grid-template-columns: 30% auto;
    grid-template-rows: 30% auto;
    grid-template-areas:
      "pig-phrases pig-avatar"
      "pig-bars    pig-avatar";
  }

  .pig-bars {
    grid-area: pig-bars;
    background: pink;
  }

  .pig-avatar {
    grid-area: pig-avatar;
    background: yellow;
  }

  .pig-phrases {
    grid-area: pig-phrases;
    background: green;
  }
</style>
