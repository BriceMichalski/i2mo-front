<template>
  <ClientOnly>
    <section>
      <!-- Grid -->
      <div class="grid h-screen grid-cols-5 z-0">
        <!-- First column -->
        <div :class="mapContainerClass">
          <MapDisplay @geojson-feature-click="handleGeoJsonFeatureClick" />
        </div>
        <!-- First column -->

        <!-- Second column -->
        <div :class="statsContainerClass" v-if="statsOnScreen">
          <LocationStatsDisplay @close-stats="closeStats" :geoProperties="clickedFeature" />
        </div>
        <!-- Second column -->
      </div>

      <!-- Grid -->
    </section>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { GeoProperties } from '~/domain/entities/GeoJson';
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const mapFullScreen = "col-span-5 z-0"
const mapHalfScreen= "col-span-3 z-0"
const statsHidden = "col-span-2 z-0"
const statsHalfScreen = "col-span-2 z-0"
const mapContainerClass = ref(mapFullScreen)
const statsContainerClass = ref(statsHidden)
const statsOnScreen = ref(false)
const clickedFeature = ref<GeoProperties | null>(null)


const handleGeoJsonFeatureClick = (props :GeoProperties) => {

  if(props.stats == null) {
    toast({
        variant: "destructive",
        title: 'Revenez plus tard !',
        description: 'Nous navons pas encore de données à propos de cette localité.'
      })
  }
  else if ( props.stats.ads_count == 0){
    toast({
        variant: "destructive",
        title: 'Revenez plus tard !',
        description: 'Cette localité ne présentais aucune annonce lors de notre derniere analyse du marché.'
      })
  }
  else {
    mapContainerClass.value = mapHalfScreen
    statsContainerClass.value = statsHalfScreen
    statsOnScreen.value = true
    clickedFeature.value = props
  }
}


const closeStats = () => {
  console.log("close stats received on map.vue")
  mapContainerClass.value = mapFullScreen
  statsContainerClass.value = statsHidden
  statsOnScreen.value = false
  clickedFeature.value = null
}
</script>
