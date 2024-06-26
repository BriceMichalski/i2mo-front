<template>
  <div class="bg-white">
    <div class="relative isolate px-6 lg:px-8">
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#1A7277] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    </div>
  </div>
  <ClientOnly>
    <section>
      <!-- Grid -->
      <div class="grid h-[calc(100vh-60px)] grid-cols-5">
        <!-- First column -->
        <div :class="mapContainerClass">
          <MapDisplay @geojson-feature-click="handleGeoJsonFeatureClick" :statsOnScreen="statsOnScreen" />
        </div>
        <!-- First column -->

        <!-- Second column -->
        <div :class="statsContainerClass" v-if="statsOnScreen">
          <StatsDisplay @close-stats="closeStats" :featureData="featureData" :geoProperties="geoProperties" />
        </div>
        <!-- Second column -->
      </div>

      <!-- Grid -->
    </section>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { GeoProperties,Stats } from '~/domain/entities/GeoJson';
import { useToast } from '@/components/ui/toast/use-toast'
import { useRoute } from 'vue-router';

const config = useRuntimeConfig()
const route = useRoute()
const { toast } = useToast()

const mapFullScreen = "col-span-5 z-0"
const mapHalfScreen= "hidden md:block md:col-span-3 z-0"
const statsHidden = "hidden"
const statsHalfScreen = "overflow-scroll col-span-5 md:col-span-2 z-0"
const mapContainerClass = ref(mapFullScreen)

const statsContainerClass = ref(statsHidden)
const statsOnScreen = ref(false)

const featureData = ref<Record<string, Stats> | null>(null)
const geoProperties = ref<GeoProperties | null>(null)


onMounted( async () => {
  handleRouteParamsSearch(route.query)
});

watch(() => route.query, (newQuery) => {
  handleRouteParamsSearch(newQuery)
})

const handleRouteParamsSearch = (query :any) => {
  const searchId =  query.code  as string;
  if(searchId != null ){
    const insee = searchId.split('-')[0]
    const zip_code = searchId.split('-')[1]
    const city = query.city  as string;
    if(zip_code != null && city != null){
      const geoProperties :GeoProperties = {
        "code": insee,
        "zip": zip_code,
        "name": city
      }
      closeStats()
      fetchLocationData(geoProperties)
    }
  }
}

const handleGeoJsonFeatureClick = async (props :GeoProperties ) => {
  fetchLocationData(props)
}

const fetchLocationData = async (props :GeoProperties ) => {
  featureData.value = null
  const response =  await fetch(config.public.apiUrl + '/api/stats?' + new URLSearchParams({
                      zip_code: props.zip,
                      insee_code: props.code
                    }));

  const data = await response.json();
  const hasData = hasAtLeastOneNonNullValue(data)
  if(!hasData) {
    closeStats()
    toast({
        variant: "destructive",
        title: 'Revenez plus tard !',
        description: 'Nous navons pas encore de données à propos de cette localité.'
      })
  }
  else {
    const wantedCode = props.code + "-" + props.zip
    const resultCode = data.insee_code + "-" + data.zip_code
    if(wantedCode == resultCode) {
      closeStats()
      mapContainerClass.value = mapHalfScreen
      statsContainerClass.value = statsHalfScreen
      statsOnScreen.value = true
      featureData.value = data
      geoProperties.value = props
    }
  }
}


function hasAtLeastOneNonNullValue(obj: Record<string, any>): boolean {
    return Object.values(obj).some(value => value !== null);
}

const closeStats = () => {
  mapContainerClass.value = mapFullScreen
  statsContainerClass.value = statsHidden
  statsOnScreen.value = false
  featureData.value = null
  geoProperties.value = null
}
</script>
