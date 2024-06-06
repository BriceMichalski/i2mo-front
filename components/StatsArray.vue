<template>

    <div v-if="stats" class="flex justify-center title">
     <h3>{{  stats.zip_code }}</h3>
    </div>
    <div v-if="stats" class="flex justify-center statsArray">
        <Table>
            <TableCaption>
              Basé sur <b>{{ stats.ads_count }}</b> {{ stats.ads_count > 1 ? "annonces" : "annonce" }} le <b>{{ formattedDate }}</b>
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead></TableHead>
                    <TableHead class="text-center" >Nombre de piéces</TableHead>
                    <TableHead class="text-center" >Surface(m2)</TableHead>
                    <TableHead class="text-center" >Loyer</TableHead>
                    <TableHead class="text-center" >Loyer au m2</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            <TableRow v-for="(name, labels) in labelsToKeep" class="text-center">
                <TableCell class="font-medium text-right">
                {{ name }}
                </TableCell>
                <TableCell>{{ stats.area_count[labels].toFixed(2) }}</TableCell>
                <TableCell>{{ stats.m2[labels].toFixed(2) }}</TableCell>
                <TableCell>{{ stats.price[labels].toFixed(2) }}</TableCell>
                <TableCell>{{ stats.price_m2[labels].toFixed(2) }}</TableCell>
            </TableRow>
            </TableBody>
        </Table>

    </div>
    <div v-if="stats">
      <Separator></Separator>
    </div>

</template>

<script setup lang="ts">
import type { Stats } from '~/domain/entities/GeoJson';
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  zipStats: Stats
}>()

const dateMAJ = ref<Date | null>(null)
const stats = ref<Stats>()
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
  if(props.zipStats != null){
      stats.value = props.zipStats
      dateMAJ.value = new  Date(props.zipStats.created_at.substring(0,23))
  }
})

watch(() => props.zipStats, (newValue) => {
  if(newValue != null){
    stats.value = newValue;
    dateMAJ.value = new  Date(newValue.created_at.substring(0,23))
  }
});

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

<style>
.title {
  color: gray;
  font-weight: bold;
  margin-top: 2vh;
}
.statsArray{
    padding: 2vh 5vh 5vh 5vh;
}
</style>