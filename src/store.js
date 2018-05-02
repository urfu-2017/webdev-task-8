import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import createPersistedState from 'vuex-persistedstate'
import pigstate from './pigstate'

Vue.use(Vuex)

const initialState = () => ({
  volumeLevel: 70,
  datetime: moment(),
  pig: {
    fat: 80,
    energy: 70,
    mood: 75,
    state: pigstate.IDLE
  }
})


const mutations = {
  update(state, newState) {
    Object.assign(state, newState)
  },

  datetime(state, datetime) {
    state.datetime = datetime
  },

  pig(state, pig) {
    Object.assign(state.pig, pig)
  },

  volume(state, volume) {
    state.volume = volume
  }
}

const actions = {
  async update({ commit, state, dispatch }) {
    const datetime = moment()
    const elapsedMs = datetime.diff(state.datetime, 'milliseconds')
    await dispatch('updatePig', elapsedMs)
    await commit('datetime', datetime)
  },

  async updatePig({ commit, state }, elapsedMs) {
    let { pig: { fat, energy, mood, state: pstate } } = state
    if (pstate === pigstate.DEAD) {
      return
    }
    const clamp = (value, k) => Math.max(Math.min(value - (elapsedMs * k), 100), 0)
    fat = clamp(fat, pstate === pigstate.EATING ? -0.00023 : 0.0001)
    energy = clamp(energy, pstate === pigstate.SLEEPING ? -0.000004 : 0.000002)
    mood = clamp(mood, pstate === pigstate.LISTENING ? 0.0002 : 0.0001)
    if ((fat === 100 && pstate === pigstate.EATING) ||
      (energy === 100 && pstate === pigstate.SLEEPING) ||
      (mood === 100 && pstate === pigstate.LISTENING)
    ) {
      pstate = pigstate.IDLE
    }
    const isDead = [fat, energy, mood].filter(Boolean).length < 2
    if (isDead) {
      pstate = pigstate.DEAD
    }
    await commit('pig', { fat, energy, mood, state: pstate })
  },

  feed({ commit, state: { pig: { state } } }) {
    if (![pigstate.DEAD, pigstate.SLEEPING].includes(state)) {
      commit('pig', { state: pigstate.EATING })
    }
  },

  interrupt({ commit, state: { pig: { state } } }) {
    if (state !== pigstate.DEAD) {
      commit('pig', { state: pigstate.IDLE })
    }
  },

  cradle({ commit, state: { pig: { state } } }) {
    if (state !== pigstate.DEAD) {
      commit('pig', { state: pigstate.SLEEPING })
    }
  },

  talk({ commit, state: { pig: { state } } }) {
    if (![pigstate.DEAD, pigstate.SLEEPING, pigstate.EATING].includes(state)) {
      commit('pig', { state: pigstate.LISTENING })
    }
  },

  restart({ commit, state: { volumeLevel } }) {
    commit('update', { ...initialState(), volumeLevel })
  }
}

const getters = {
  pig: ({ pig }) => pig,
  isNight: ({ datetime: dt }) => moment(dt).hour() >= 22 || moment(dt).hour() <= 5,
  state: state => state,
  needsAttention: ({ pig: { fat, energy, mood } }) => [fat, energy, mood].some(x => x <= 10),
  volume: ({ volume }) => volume
}

const store = new Vuex.Store({
  state: initialState(),
  getters,
  actions,
  plugins: [createPersistedState()],
  mutations
})

setInterval(() => {
  store.dispatch('update')
}, 1000)

export default store

if (module.hot) {
  store.hotUpdate({
    state: initialState(),
    getters,
    actions,
    mutations
  })
}
