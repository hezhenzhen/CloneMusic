import Vue from 'vue'
import Vuex from 'vuex'
// import state from './state'
// import * as getters from './getters'
// import * as mutations from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    disc: {},
    cursong: {},
    currentTime: 0,
    currentPos: 0,
    totalTime: 0,
    change: false,
    tmpCurrentTime: 0,
    playing: false
  },
  getters: {
    disc: state => state.disc,
    cursong: state => state.cursong,
    currentTime: state => state.currentTime,
    totalTime: state => state.totalTime,
    change: state => state.change,
    tmpCurrentTime: state => state.tmpCurrentTime,
    playing: state => state.playing,
    currentPos: state => {
      return state.currentTime / state.totalTime * 100
    }
  },
  mutations: {
    play (state) {
      state.playing = true
    },
    pause (state) {
      state.playing = false
    },
    setDisc (state, disc) {
      state.disc = disc
    },
    setCur (state, song) {
      state.cursong = song
    },
    updateCurrentTime (state, time) {
      state.currentTime = time
    },
    updatetotalTime (state, time) {
      state.totalTime = time
    },
    setChange (state, flag) {
      state.change = flag
    },
    changeTime (state, time) {
      state.tmpCurrentTime = time
    },
    setCurrentPos (state, pos) {
      state.currentPos = pos
    }
  }
})

export default store
