import { SET_DISC } from './mutation-types'

const mutations = function () {
  [SET_DISC] (state, disc) {
    state.disc = disc
  }
}

export default mutations
