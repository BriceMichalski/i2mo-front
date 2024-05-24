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

      <!-- Ajouter un marqueur à la position de l'utilisateur -->
      <LMarker :lat-lng="targetCoords">
        <LPopup>
          <p>Vous êtes ici!</p>
        </LPopup>
      </LMarker>

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

type LatLng = [number, number];

const map = ref<L.Map>()
const zoom = ref(7);
const mapCenter = ref<LatLng>([46.133950, 2.124950]);
const targetCoords = ref<LatLng>([0, 0]);
const targetZoom = 13;
const factor = 0.8; // Adjust the increment as needed
const interval = 200; // Milliseconds between each zoom increment
const geojsondata = ref()
const emit = defineEmits<{
  (e: 'geojson-feature-click', value: GeoProperties): void
}>()


const mapReady = () => {
  if(map.value){
    centerUser();
    map.value.leafletObject.on('moveend', debouncedGetGeoJson)
    map.value.leafletObject.on('zoomend', debouncedGetGeoJson)
  }
}



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

const interpolate = (start: number, end: number, factor: number) => start + (end - start) * factor;

const moveTowards = (current: LatLng, target: LatLng, factor: number): LatLng => [
  interpolate(current[0], target[0], factor),
  interpolate(current[1], target[1], factor),
];

const getGeoJson = async () => {

  if(map.value != null) {
    if(map.value.leafletObject.getZoom() < 13){
      geojsondata.value = null
      return;
    }
    const bounds = map.value.leafletObject.getBounds();
    const topLeft = bounds.getNorthWest();
    const bottomRight = bounds.getSouthEast();

    const response =  await fetch('http://127.0.0.1:5000/api/geojson?' + new URLSearchParams({
          tl_lat: topLeft.lat,
          tl_lon: topLeft.lng,
          br_lat: bottomRight.lat,
          br_lon: bottomRight.lng,
        }));

    geojsondata.value = await response.json();
  };
};
const debouncedGetGeoJson = debounce(getGeoJson, 2000);

const centerUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      targetCoords.value = [position.coords.latitude, position.coords.longitude];

      const recenter = setInterval(() => {
        mapCenter.value = moveTowards(mapCenter.value, targetCoords.value, factor);
        if(Math.abs(mapCenter.value[0] - targetCoords.value[0]) < 0.001 && Math.abs(mapCenter.value[1] - targetCoords.value[1]) < 0.001){
          clearInterval(recenter);
          zoomUser()
        }
      }, interval);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

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
