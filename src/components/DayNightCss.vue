<template>
    <link v-if="isNight" rel="stylesheet" type="text/css" href="/static/night.css">
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component
export default class DayNightCss extends Vue {
 @Getter isNight
}
</script>
