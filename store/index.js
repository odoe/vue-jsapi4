import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    map: null,
    watchHandle: null,
    camera: {
      position: {
        x: -9177356,
        y: 4246783,
        z: 723,
        spatialReference: {
          wkid: 3857
        }
      },
      heading: 0,
      tilt: 83
    }
  }
})

export default store
