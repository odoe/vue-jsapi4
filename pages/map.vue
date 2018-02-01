<template>
  <section class="container">
    <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      This page is loaded from the {{ name }}
    </h1>
    <h2 class="info" v-if="name === 'client'">
      Please refresh the page
    </h2>
    <div id="viewDiv"></div>
    <nuxt-link class="button" to="/">
      Home page
    </nuxt-link>
    <nuxt-link class="button" to="/about">
      About page
    </nuxt-link>
  </section>
</template>
<script>
import { loadModules } from 'esri-loader'

export default {
  data ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head () {
    return {
      title: `Map Page (${this.name}-side)`
    }
  },
  mounted () {
    console.log('map: mounted')
    loadModules([
      'esri/Map',
      'esri/views/SceneView',
      'esri/core/watchUtils'
    ], {
      // use a specific version instead of latest 4.x
      url: 'https://js.arcgis.com/4.2/'
    }).then(([EsriMap, SceneView, watchUtils]) => {
      // create map with the given options at a DOM node w/ id 'mapNode'
      let map
      if (!this.$store.state.map) {
        map = new EsriMap({
          basemap: 'satellite',
          ground: 'world-elevation'
        })
        this.$store.state.map = map
      } else {
        map = this.$store.state.map
      }
      const view = new SceneView({
        container: 'viewDiv',
        map,
        camera: this.$store.state.camera
      })

      this.$store.state.watchHandle = watchUtils.watch(view, 'camera', (camera) => {
        console.log('change')
        this.$store.state.camera = camera.clone().toJSON()
      })

      // NOTE: important: now that we're using a promise
      // your callback must NOT return any v4.x classes that resolve to promises
      // this will cause a hole in the space-time continum that will kill us all
      // return view
    })
  },
  beforeDestroy () {
    console.log('map: beforeDestroy')
    this.$store.state.watchHandle.remove()
  }
}
</script>

<style scoped>
@import url('https://js.arcgis.com/4.2/esri/css/main.css');

#viewDiv {
  height: 500px;
  width: 100%;
}

.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
