<template>
  <section v-if="onScreenGeoProperties">
    <div class="flex items-center">
      <Button variant="outline" size="icon" id="closeBtn" @click="$emit('close-stats')">
        <ChevronRightIcon class="w-4 h-4" />
      </Button>
      <div class="justify-center statsTitle">
          <h2><b>{{ onScreenGeoProperties.name }}</b> <span v-if="onScreenData">- {{ onScreenData.zip_code }}</span></h2>
      </div>
    </div>

    <Separator />
    <Tabs default-value="stats" class="mt-1 p-2">
      <TabsList>
        <TabsTrigger value="stats">
          Statistiques
        </TabsTrigger>
        <TabsTrigger value="risk">
          Risques
        </TabsTrigger>
      </TabsList>
      <TabsContent value="stats">
        <div v-if="onScreenData">
          <ChartsNormalDistribution :mean="onScreenData.price_m2.mean" :stddev="onScreenData.price_m2.std"/>
          <StatsArray :zip-stats="onScreenData"/>
        </div>
      </TabsContent>
      <TabsContent value="risk">
        <div v-if="onScreenData" >
          <GeoRisk :insee="onScreenData?.insee_code"/>
        </div>
      </TabsContent>
    </Tabs>
  </section>
</template>

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
const onScreenData = ref<Stats | null>(null)

watch(() => props.featureData, (newValue) => {
  onScreenData.value = null
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


<style>
.statsTitle{
    margin-left: 2vh;

    margin-top: 0vh;
}

#closeBtn{
    margin: 1vh;
}
</style>