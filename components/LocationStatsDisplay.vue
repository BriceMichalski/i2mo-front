<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { GeoProperties,Stats } from '~/domain/entities/GeoJson';
import { ChevronRightIcon } from '@radix-icons/vue';
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  featureData: Record<string,Stats> | null;
  geoProperties: GeoProperties | null;
}>()

// Watch for changes in props.geoProperties and update onScreenGeoProperties accordingly
const onScreenGeoProperties = ref<GeoProperties | null>(null)
const onScreenData = ref<Record<string,Stats> | null>(null)

watch(() => props.featureData, (newValue) => {
  if(newValue != null){
    onScreenData.value = newValue;
  }
});
watch(() => props.geoProperties, (newValue) => {
  if(newValue != null){
    onScreenGeoProperties.value = newValue;
  }
});

onMounted(() => {
    if(props.featureData != null){
        onScreenData.value = props.featureData
    }
    if(props.geoProperties != null){
        onScreenGeoProperties.value = props.geoProperties
    }
  })
</script>

<template>
  <section v-if="onScreenGeoProperties">
    <Button variant="outline" size="icon" id="closeBtn" @click="$emit('close-stats')">
        <ChevronRightIcon class="w-4 h-4" />
    </Button>
    <div class="flex justify-center statsTitle">
        <h2>Statistiques pour <b>{{ onScreenGeoProperties.nom }}</b></h2>
    </div>
    <Separator />
    <div v-for="(value, name, index) in onScreenData">
      <StatsArray :zip-stats="value"/>
    </div>

  </section>
</template>

<style>
.statsTitle{
    margin: 1vh;
    margin-top: 0vh;
}

#closeBtn{
    margin: 1vh;
}
</style>