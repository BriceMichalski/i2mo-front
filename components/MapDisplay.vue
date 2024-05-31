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
import { debounce } from 'lodash';
import type { GeoProperties } from '~/domain/entities/GeoJson';
import { useToast } from '@/components/ui/toast/use-toast'
import { useRoute } from 'vue-router'


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
const interval = 200; // Milliseconds between each zoom increment


const emit = defineEmits<{
  (e: 'geojson-feature-click', value: GeoProperties): void
}>()

onMounted( async () => {
  const lat = route.query.lat ? Number(route.query.lat) : null
  const long = route.query.long ? Number(route.query.long) : null

  if(lat != null && long != null){
    const shiftedLong = long + 0.001;
    centerOn(lat,shiftedLong)
  } else {
    centerUser()
  }
});

watch(() => route.query, (newQuery) => {
  const lat = newQuery.lat ? Number(newQuery.lat) : null
  const long = newQuery.long ? Number(newQuery.long) : null
  if(lat != null && long != null){
    const shiftedLong = long + 0.001;
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
  const color = generateColor(feature.properties.code);
  return {
    color: color,
    opacity: 0.09, // Exemple de valeur d'opacité
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

    const response =  await fetch('http://127.0.0.1:8080/api/geojson?' + new URLSearchParams({
          tl_lat: topLeft.lat,
          tl_lon: topLeft.lng,
          br_lat: bottomRight.lat,
          br_lon: bottomRight.lng,
        }));

    geojsondata.value = await response.json();
  };
};
const debouncedGetGeoJson = debounce(getGeoJson, 1000);

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
    if(Math.abs(mapCenter.value[0] - targetCoords.value[0]) < 0.001 && Math.abs(mapCenter.value[1] - targetCoords.value[1]) < 0.001){
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



const handleGeoJsonClick = (event: any) => {
  emit('geojson-feature-click', event.layer.feature.properties);
};
</script>

<style>
body {
  margin: 0;
}
</style>
