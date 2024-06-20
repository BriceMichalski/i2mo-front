<template>
  <div class="h-[calc(100vh-60px)] -z-10" >
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

      <LControl position="topright">
        <form class="max-w-sm mx-auto">
          <select id="countries"
                  v-model="calque"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="zip_code">Code postale</option>
            <option value="m2">Surface</option>
            <option value="price">Prix</option>
            <option value="price_m2">Prix / m2 </option>
          </select>
        </form>
      </LControl>
    </LMap>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { debounce, zip } from 'lodash-es';
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
const centerPrecision = 0.001
const currentDisplayedCode = ref("")

const props = defineProps<{
  statsOnScreen: boolean ;
}>()

watch(() => props.statsOnScreen, async(newValue) => {
  if(newValue == false){
    currentDisplayedCode.value = ""
    debouncedGetGeoJson()
  }
})

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

const zipCodeColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return "#" + "00000".substring(0, 6 - color.length) + color;
};

const minValue = ref(0);
const maxValue = ref(100);

const calculateMinMaxValues = (geojsondata) => {
  let min = Infinity;
  let max = -Infinity;

  if (calque.value != 'zip_code') {
    geojsondata.features.forEach(feature => {
      const add_field = feature.properties.added_field;
      if (add_field != undefined) {
        const value = feature.properties.added_field.mean;
        if (value != undefined) {
          if (value < min) min = value;
          if (value > max) max = value;
        }

      }
    }
  )};

  return { min, max };
};

watch(geojsondata, (newData) => {
  if (newData) {
    const { min, max } = calculateMinMaxValues(newData);
    minValue.value = min;
    maxValue.value = max;
  }
});

const heatMap = (value: number) => {
  // Apply a power function to exaggerate the extremes
  const power = 0.6; // Adjust this value to control the steepness
  const percentage = Math.pow(value, power);

  // Interpolate between blue and red
  const r = Math.floor(255 * percentage);
  const g = Math.floor(255 * (1 - percentage));
  const b = 100;

  return `rgb(${r},${g},${b})`;
};


const calque = ref('zip_code');
const calqueToFctMap = {
  "zip_code": zipCodeColor,
  "m2": heatMap,
  "area_count": heatMap,
  "price": heatMap,
  "price_m2": heatMap,
}

watch(() => calque.value, (newValue) => {
  getGeoJson()
})


const geoStyler = (feature: any) => {
  const code = feature.properties.code + "-" +feature.properties.zip
  if(code != currentDisplayedCode.value){
    const styleFunction = calqueToFctMap[calque.value];
    var color;

    if (calque.value === 'zip_code') {
      color = styleFunction(feature.properties.code);
    }
    else {
      const added_field = feature.properties["added_field"];
      if (added_field !== undefined && added_field["count"] > 2 ) {
        const value = feature.properties["added_field"]["mean"];
        if (value !== undefined) {
          // Normalisez la valeur en utilisant une plage appropriée (ici 0 à 1)
          // Vous devrez peut-être ajuster cette partie en fonction de vos données réelles
          const normalizedValue = (value - minValue.value) / (maxValue.value - minValue.value);
          color = styleFunction(normalizedValue);
        }
      } else {
        color = 'darkgray'; // Couleur par défaut si aucune donnée
      }
    }

    return {
      fillColor: color,
      color: 'gray',  // Bordure noire pour un meilleur contraste
      weight: 1,         // Épaisseur de la bordure
      opacity: 0.8,
      fillOpacity: 0.3,  // Augmenter l'opacité de remplissage
    };
  }
    return {
        fillColor: 'orange',
        weight: 3,
        opacity: 1,
        color: 'red',  //Outline color
        fillOpacity: 0.1
    };
};


// FETCH GEOJSON DATA
const getGeoJson = async () => {
  if(map.value != null) {
    if(map.value.leafletObject.getZoom() < 11){
      debouncedtoastMapTooBig()
      return;
    }
    const bounds = map.value.leafletObject.getBounds();
    const topLeft = bounds.getNorthWest();
    const bottomRight = bounds.getSouthEast();

    var uri = config.public.apiUrl + '/api/geojson?' + new URLSearchParams({
          tl_lat: topLeft.lat,
          tl_lon: topLeft.lng,
          br_lat: bottomRight.lat,
          br_lon: bottomRight.lng,
        })

    if(calque.value != 'zip_code'){
      uri += '&add_field=' + calque.value
    }

    const response =  await fetch(uri);

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
    if(Math.abs(mapCenter.value[0] - targetCoords.value[0]) < centerPrecision && Math.abs(mapCenter.value[1] - targetCoords.value[1]) < centerPrecision){
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
  const code = event.layer.feature.properties.code + "-" + event.layer.feature.properties.zip
  currentDisplayedCode.value = code;
  console.log(code)
  const shiftedLong = event.latlng.lng + 0.04;
  centerOn(event.latlng.lat,shiftedLong)
};
</script>

