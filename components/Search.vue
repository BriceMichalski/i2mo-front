<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { MagnifyingGlassIcon } from '@radix-icons/vue';
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es';
import type { GeoSearchResult, GeoJsonItem } from '~/domain/entities/Search';

const open = ref(false)
const search = ref("")
const keys = useMagicKeys()
const CmdJ = keys['Cmd+J']
const results = ref<GeoJsonItem[]>([])
function handleOpenChange() {
  open.value = !open.value
}

watch(CmdJ, (v) => {
  if (v)
    handleOpenChange()
})

const autocomplete = async () => {
  if(search.value.length > 2){
    const response =  await fetch('https://api-adresse.data.gouv.fr/search/?' + new URLSearchParams({
          q: encodeURI(search.value),
          limit: "5",
          type: "municipality"
        }));
    const data = await response.json()
    results.value = data.features
  }
}
const debAutocomplete = debounce(autocomplete, 500);

const clickedResult = async (item: GeoJsonItem) => {
  await navigateTo({
    path: '/map',
    query: {
      long: item.geometry.coordinates[0],
      lat: item.geometry.coordinates[1],
      code: item.properties.citycode + "-" + item.properties.postcode,
      city: item.properties.city
    }
  })
  handleOpenChange()
}

const highlightMatch = (text: string) => {
  if (!search.value) return text;
  const regex = new RegExp(`(${search.value})`, 'gi');
  return text.replace(regex, '<b>$1</b>');
}

watch(search, (v) => {
  if (v) {
    if(v.length > 2){
      results.value = []
      debAutocomplete()
    } else {
      results.value = []
    }
  } else {
      results.value = []
    }
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground" @click="handleOpenChange">
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
      >
      <MagnifyingGlassIcon class="w-4 h-4 mr-2" /> <p class="hidden md:block">Rechercher</p>
            <kbd
        class="hidden  pointer-events-none md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-3"
      ><span class="text-xs">⌘</span>J</kbd>
    </Button>

    </p>
    <CommandDialog :open="open" @update:open="handleOpenChange">
      <CommandInput v-model="search" placeholder="Entrer votre recherche ici ..." />
      <CommandList>
        <CommandEmpty v-if="search.length > 2" >No results found.</CommandEmpty>
        <CommandEmpty v-if="search.length <= 2" >Commencez à saisir une ville pour voir les resultats</CommandEmpty>
        <CommandGroup heading="Localité">
          <CommandItem
            v-for="(result,index) in results"
            :key="result.properties.id"
            :value="search + ':'+index"
            @click="clickedResult(result)"

            >

            <span v-html="highlightMatch(result.properties.label + ' (' + result.properties.postcode + ')')"></span><span class="text-xs ml-3 text-gray-800">{{ result.properties.context }}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>