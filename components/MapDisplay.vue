<template>
  <div style="height:100%; width:100%">
    <LMap
      ref="map"
      :zoom="zoom"
      :center="mapCenter"
      :min-zoom="7"
      :zoom-animation="true"
      @ready="mapReady()"
    >
      <LTileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />

      <LGeoJson
        v-if="geojsondata !== null"
        :geojson="geojsondata"
        :options-style="geoStyler"
        @click="handleGeoJsonClick"
      />

    </LMap>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { debounce } from 'lodash-es';
import type { GeoProperties } from '~/domain/entities/GeoJson';
import { useToast } from '@/components/ui/toast/use-toast'
import { useRoute } from 'vue-router'

const config = useRuntimeConfig()
const { toast } = useToast()
type LatLng = [number, number];

const route = useRoute()
const geojsondata = ref()
const map = ref<L.Map>()

const zoom = ref(7);
const mapCenter = ref<LatLng>([46, 2]);
const targetCoords = ref<LatLng>([0, 0]);
const targetZoom = 13;
const factor = 0.8; // Adjust the increment as needed
const interval = 100; // Milliseconds between each zoom increment
const currentDisplayedCode = ref("")

const emit = defineEmits<{
  (e: 'geojson-feature-click', value: GeoProperties): void
}>()

onMounted( async () => {
  const lat = route.query.lat ? Number(route.query.lat) : null
  const long = route.query.long ? Number(route.query.long) : null
  currentDisplayedCode.value = route.query.code as string

  if(lat != null && long != null){
    const shiftedLong = long + 0.04;
    centerOn(lat,shiftedLong)
  } else {
    centerUser()
  }
});

watch(() => route.query, (newQuery) => {
  const lat = newQuery.lat ? Number(newQuery.lat) : null
  const long = newQuery.long ? Number(newQuery.long) : null
  currentDisplayedCode.value = route.query.code as string

  if(lat != null && long != null){
    const shiftedLong = long + 0.04;
    centerOn(lat,shiftedLong)
  }
})

const mapReady = () => {
  if(map.value){
    map.value.leafletObject.on('moveend', debouncedGetGeoJson)
    map.value.leafletObject.on('zoomend', debouncedGetGeoJson)
  }
}

// MAP COLOR & STYLE
const generateColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return "#" + "00000".substring(0, 6 - color.length) + color;
};

const geoStyler = (feature: any) => {
  if(feature.properties.code != currentDisplayedCode.value){
    const color = generateColor(feature.properties.code);
    return {
      color: color,
      opacity: 0.09, // Exemple de valeur d'opacité
    };
  }
    return {
        fillColor: 'orange',
        weight: 3,
        opacity: 1,
        color: 'red',  //Outline color
        fillOpacity: 0.03
    };
};


// FETCH GEOJSON DATA
const getGeoJson = async () => {
  if(map.value != null) {
    if(map.value.leafletObject.getZoom() < 12){
      debouncedtoastMapTooBig()
      return;
    }
    const bounds = map.value.leafletObject.getBounds();
    const topLeft = bounds.getNorthWest();
    const bottomRight = bounds.getSouthEast();

    const response =  await fetch( config.public.apiUrl + '/api/geojson?' + new URLSearchParams({
          tl_lat: topLeft.lat,
          tl_lon: topLeft.lng,
          br_lat: bottomRight.lat,
          br_lon: bottomRight.lng,
        }));

    geojsondata.value = await response.json();
  };
};
const debouncedGetGeoJson = debounce(getGeoJson, 500);

// TOAST MSG
const toastMapTooBig = () => {
  toast({
        title: 'Carte trop grande',
        description: 'La carte est trop grande pour afficher des données, veuillez zoomer sur une zone'
      })
}
const debouncedtoastMapTooBig = debounce(toastMapTooBig, 5000);


// MOVE MAP VIEW
const interpolate = (start: number, end: number, factor: number) => start + (end - start) * factor;

const moveTowards = (current: LatLng, target: LatLng, factor: number): LatLng => [
  interpolate(current[0], target[0], factor),
  interpolate(current[1], target[1], factor),
];

const centerUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      centerOn(position.coords.latitude,position.coords.longitude)
    })
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

const centerOn = (lat :number,long :number) => {
  targetCoords.value = [lat, long];
  const recenter = setInterval(() => {
    mapCenter.value = moveTowards(mapCenter.value, targetCoords.value, factor);
    if(Math.abs(mapCenter.value[0] - targetCoords.value[0]) < 0.01 && Math.abs(mapCenter.value[1] - targetCoords.value[1]) < 0.01){
      clearInterval(recenter);
      zoomUser()
    }
  }, interval);
}


const zoomUser = () => {
  // Start progressive zoom and recenter
  const zoomIn = setInterval(() => {
      if (zoom.value < targetZoom) {
        zoom.value += factor;
      }

      // Stop the interval when the zoom target is reached and the position is close enough
      if (zoom.value >= targetZoom) {
        clearInterval(zoomIn);
        getGeoJson()
      }
  }, interval);
}



const handleGeoJsonClick = async (event: any) => {
  await navigateTo({
    query: {}
  })
  emit('geojson-feature-click', event.layer.feature.properties);
  currentDisplayedCode.value = event.layer.feature.properties.code;

  const shiftedLong = event.latlng.lng + 0.04;
  centerOn(event.latlng.lat,shiftedLong)
};
</script>

<style>
body {
  margin: 0;
}
</style>
