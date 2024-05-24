<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { defineProps, ref } from 'vue';
import type { GeoProperties } from '~/domain/entities/GeoJson';
import { ChevronRightIcon } from '@radix-icons/vue';


const props = defineProps<{
  geoProperties: GeoProperties | null;
}>()


// Watch for changes in props.geoProperties and update onScreenGeoProperties accordingly
const onScreenGeoProperties = ref<GeoProperties | null>(null)
const dateMAJ = ref<Date | null>(null)

watch(() => props.geoProperties, (newValue) => {
  if(newValue != null){
    onScreenGeoProperties.value = newValue;
    dateMAJ.value = new  Date(newValue?.stats.created_at.substring(0,23))
  }
});

const labelsToKeep = {
    mean: 'Moyenne',
    min: 'Minimum',
    max: 'Maximun',
    p25: '25 percentile',
    p50: '50 percentile',
    p75: '75 percentile',
    std: 'Écart type',
};

onMounted(() => {
    if(props.geoProperties != null){
        onScreenGeoProperties.value = props.geoProperties
        dateMAJ.value = new  Date(props.geoProperties.stats.created_at.substring(0,23))
    }
})

const formattedDate = computed(() => {
  if (dateMAJ.value) {
    const datePart = dateMAJ.value.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const timePart = dateMAJ.value.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${datePart} à ${timePart}`;
  }
  return 'No Date';
});

</script>

<template>
  <section v-if="onScreenGeoProperties?.stats">
    <Button variant="outline" size="icon" id="closeBtn" @click="$emit('close-stats')">
        <ChevronRightIcon class="w-4 h-4" />
    </Button>
    <div class="flex justify-center statsTitle">
        <h2>Statistiques pour <b>{{ onScreenGeoProperties.nom }}</b></h2>

    </div>
    <div class="flex justify-center">
        <h3>{{ onScreenGeoProperties.stats.zip_code }}</h3>
    </div>

    <div class="flex justify-center statsArray">
        <Table>
            <TableCaption>Mise à jours le:<br/> <b></b>{{ formattedDate }}
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead></TableHead>
                    <TableHead class="text-center" >Nombre de piéces</TableHead>
                    <TableHead class="text-center" >Surface(m2)</TableHead>
                    <TableHead class="text-center" >Prix</TableHead>
                    <TableHead class="text-center" >Prix au m2</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            <TableRow v-for="(name, labels) in labelsToKeep" class="text-center">
                <TableCell class="font-medium text-right">
                {{ name }}
                </TableCell>
                <TableCell>{{ onScreenGeoProperties.stats.area_count[labels].toFixed(2) }}</TableCell>
                <TableCell>{{ onScreenGeoProperties.stats.m2[labels].toFixed(2) }}</TableCell>
                <TableCell>{{ onScreenGeoProperties.stats.price[labels].toFixed(2) }}</TableCell>
                <TableCell>{{ onScreenGeoProperties.stats.price_m2[labels].toFixed(2) }}</TableCell>
            </TableRow>
            </TableBody>
        </Table>
    </div>
  </section>
</template>

<style>
.statsTitle{
    margin: 1vh;
    margin-top: 0vh;
}

.statsArray{
    padding: 5vh;
}

#closeBtn{
    margin: 1vh;
}
</style>