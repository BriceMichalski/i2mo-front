<template>
    <div class="grid grid-cols-2" >
        <div v-for="risk in displayedRisk" class="block col-span-2  lg:col-span-1 p-2 items-stretch " >
            <div class=" bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="flex items-center p-4 w-full">
                    <Icon :name="getIcon(risk.num_risque)" size="24" :class="getClass(risk.num_risque)"  />
                    <span class="ml-4 text-gray-700 font-medium">{{  risk.libelle_risque_long  }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { RiskResponse, RiskDetail } from '~/domain/entities/GeoRisk';


const props = defineProps<{
  insee: string;
}>()

const riskDetails = ref<RiskDetail[]>()
const displayedRisk = computed(() => {
    return riskDetails.value?.filter(risk => risk.num_risque in iconMapping)
})

interface IconMapping {
  [key: string]: {
    icon: string;
    color: string;
  };
}


const iconMapping :IconMapping = {
    // Mouvement de terrain
    "134": {
        icon: "fa6-solid:house-chimney-crack",
        color: "text-amber-500",
    },
    // Innondation
    "140": {
        icon: "fa6-solid:house-flood-water",
        color: "text-blue-500",
    },
    // Séisme
    "158": {
        icon: "fa6-solid:mountain",
        color: "text-amber-700",
    },
    // Phénomène lié à l'atmosphère
    "167": {
        icon: "fa6-solid:cloud",
        color: "text-gray-500",
    },
    // Tempête et grains (vent)
    "169": {
        icon: "fa6-solid:wind",
        color: "text-blue-500",
    },
    // Foudre
    "175": {
        icon: "fa6-solid:bolt",
        color: "text-yellow-500",
    },
    // Grêle
    "176": {
        icon: "fa6-solid:cloud-meatball",
        color: "text-gray-400",
    },
    // Neige et pluies verglaçantes
    "177": {
        icon: "fa6-solid:snowflake",
        color: "text-blue-200",
    },
    // Rupture de barrage
    "213": {
        icon: "fa6-solid:house-tsunami",
        color: "text-blue-500",
    },
    // Risque industriel
    "215": {
        icon: "fa6-solid:industry",
        color: "text-gray-500",
    },
    // Transport de marchandises dangereuses
    "226": {
        icon: "fa6-solid:truck",
        color: "text-orange-500",
    },
    // Radon
    "229": {
        icon: "fa6-solid:radiation",
        color: "text-green-500",
    },
    // Effet thermique
    "236": {
        icon: "fa6-solid:fire",
        color: "text-red-700",
    },
    // Effet de surpression
    "237": {
        icon: "fa6-solid:explosion",
        color: "text-red-600",
    },
    // Effet toxique
    "238": {
        icon: "fa6-solid:biohazard",
        color: "text-purple-600",
    },
};
const getIcon = (num_risque: string) => {
    return iconMapping[num_risque].icon;
};
const getClass = (num_risque: string) => {
    return iconMapping[num_risque].color;
};


onMounted(async () => {
    fetchGeoRisk(props.insee)
});

watch(() => props.insee, async (insee) => {
    fetchGeoRisk(insee)
})


const fetchGeoRisk = async (insee: string) => {
    if (insee === null ) return;

    insee = mapToRisqueInsee(insee)
    const response =  await fetch('https://georisques.gouv.fr/api/v1/gaspar/risques?' + new URLSearchParams({
        "code_insee": insee,
        "rayon": "0"
    }));

    const riskResponse :RiskResponse = await response.json();
    if(riskResponse.data[0] === undefined) return;


    riskDetails.value = riskResponse.data[0].risques_detail
}


const mapToRisqueInsee = (insee: string ) : string => {
    const mapping: { [key: string]: string } = {
        // Marseille
        "13201":"13055",
        "13202":"13055",
        "13203":"13055",
        "13204":"13055",
        "13205":"13055",
        "13206":"13055",
        "13207":"13055",
        "13208":"13055",
        "13209":"13055",
        "13210":"13055",
        "13211":"13055",
        "13212":"13055",
        "13213":"13055",
        "13214":"13055",
        "13215":"13055",
        "13216":"13055",
        // Lyon
        "69123":"69123",
        "69126":"69123",
        "69381":"69123",
        "69382":"69123",
        "69383":"69123",
        "69384":"69123",
        "69385":"69123",
        "69386":"69123",
        "69387": "69123",
        "69388":"69123",
        // Paris
        "75101": "75056",
        "75102": "75056",
        "75103": "75056",
        "75104": "75056",
        "75105": "75056",
        "75106": "75056",
        "75107": "75056",
        "75108": "75056",
        "75109": "75056",
        "75110": "75056",
        "75111": "75056",
        "75112": "75056",
        "75113": "75056",
        "75114": "75056",
        "75115": "75056",
        "75116": "75056",
        "75117": "75056",
        "75118": "75056",
        "75119": "75056",
        "75120": "75056",

    }
    return mapping[insee] ?? insee;
}
</script>