<template>
  <div class="container">
    <div :key="phrase" class="animated fadeOutUp speech">{{phrase}}</div>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import { Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import pigstate from '../pigstate'


@Component
export default class PigSpeech extends Vue {
  @Getter pig
  @Getter needsAttention
  @Getter isNight
  @Getter volumeLevel

  isTalking = false
  phrase = ''

  get phrases() {
    switch (this.pig.state) {
      case pigstate.IDLE:
        return ['привет', 'как дела?', 'хрю-хрю', this.isNight ? 'уже темно, а ты еще не спишь...' : 'ты хорошо выглядишь']
      case pigstate.LISTENING:
        return ['ага, а дальше что?', 'ой, это как так?', 'и что?', 'блиин', 'я так и знала', 'мдаааааа...']
      case pigstate.SLEEPING:
        return ['*храпит*', 'z-z-z', '...']
      case pigstate.EATING:
        return ['как вкусно!', 'ном-ном :з', '(^___^)', 'давай еще', this.isNight ? 'на ночь есть вредно.' : 'какие прекрасные килобайты']
      default:
        return []
    }
  }

  updatePhrase() {
    const needsAttention = this.pig.state !== pigstate.DEAD && this.needsAttention
    this.phrase = _.sample(this.phrases.concat(needsAttention ?
      ['посмотри на меня!', 'мне плохо...', 'тебе на меня наплевать :\'('] : []))
    if (speechSynthesis && !this.isTalking) {
      this.isTalking = true
      const utterance = new SpeechSynthesisUtterance(this.phrase)
      utterance.volume = this.volumeLevel / 100
      utterance.onstart = () => {
        setTimeout(() => {
          this.isTalking = false
        }, 10000)
      }
      speechSynthesis.speak(utterance)
    }
    setTimeout(() => this.updatePhrase(), _.random(1000, 2000))
  }

  created() {
    setTimeout(() => this.updatePhrase(), _.random(1000, 2000))
  }
}
</script>

<style scoped>
  .container {
    position: relative;
    height: 100%;
  }

  .speech {
    position: absolute;
    right: 0;
    bottom: 0;
  }
</style>
