<template>


<div class="bg-white">
  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#1A7277] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 top-40 z-50">
      <!-- <div class="hidden sm:mb-8 sm:flex sm:justify-center">
        <div class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          De future fonctionnalités supplémentaires sont à venir <a href="#" class="font-semibold text-indigo-600"><span class="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>
        </div>
      </div> -->
      <div class="text-center inset-x-0 top-0 z-50">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Des statistiques immobilieres à vos cotés</h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">Prenez des décisions éclairées et maximisez vos investissements immobiliers grâce à notre analyse de données.</p>
        <div class=" inset-x-0 top-0 z-50 mt-10 flex items-center justify-center gap-x-6">
          <NuxtLink to="/map" class="relative rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
            Explorer Maintenant
          </NuxtLink>
          <a href="#stats-explained" class="text-sm font-semibold leading-6 text-gray-900"> En savoir plus <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>
    <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
      <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1A7277] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
  </div>
</div>


<div class="bg-white">
  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 mt-48" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[150deg] bg-gradient-to-tr from-[#9089fc] to-[#1A7277] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>

    <div class="overflow-hidden py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div class="lg:pr-8 lg:pt-4">
            <div class="lg:max-w-lg">
              <h2 class="text-base font-semibold leading-7 text-indigo-600">Restez informé</h2>
              <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Optimisez vos décisions immobilières avec des données précises et fiables</p>

              <dl class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                <div v-for="feature in features" :key="feature.name" class="relative pl-9">
                  <dt class="inline font-semibold text-gray-900">
                    <component :is="feature.icon" class="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                    {{ feature.name }}
                  </dt>
                  <br/>
                  <dd class="inline">{{ feature.description }}</dd>
                </div>
              </dl>
            </div>
          </div>
          <img src="/img/_d6ca10b8-9d9d-4b45-a941-8a660a87e265.jpeg" alt="Product screenshot" class="w-[38rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[47rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" />
        </div>
      </div>
    </div>

    <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
      <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1A7277] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
  </div>
</div>

<div class="bg-white" id="stats-explained">
  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[520/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#9089fc] to-[#1A7277] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56 top-40 z-50">
      <div class="mb-10">
        <h2 class="text-base font-semibold leading-7 text-indigo-600">Comprendre et Interpréter</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Les valeurs statistiques élémentaires</p>
      </div>
      <div class="inset-x-0 top-0 z-50">
        <Accordion type="single" class="w-full" collapsible :default-value="opennedItem">
          <AccordionItem v-for="item in accordionItems" :key="item.title" :value="item.title">
            <AccordionTrigger class="text-gray-700">{{ item.title }}</AccordionTrigger>
            <AccordionContent>
              <p class="text-gray-600 mt-2 mb-2 text-center">{{ item.content }}</p>
              <Separator class="m-5"/>
              <ul class="list-disc list-outside ms-8 mt-2 mb-2">
                <div v-for="tip in item.tips" class="relative text-gray-600 m-3">
                <li class="text-justify">{{ tip }}</li>
                </div>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
    <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
      <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#1A7277] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
  </div>
</div>

</template>


<script setup>
import { CounterClockwiseClockIcon,MagnifyingGlassIcon,BarChartIcon,DotFilledIcon } from '@radix-icons/vue';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const features = [
  {
    name: 'Données actualisées',
    description:
      'Accédez à des informations rafraichies fréquemment pour rester à jour avec les dernières tendances du marché.',
    icon: CounterClockwiseClockIcon,
  },
  {
    name: 'Analyse approfondie',
    description: 'Utilisez nos outils d\'analyse pour obtenir des insights détaillés et prendre des décisions informées.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Optimisation des investissements',
    description: 'Maximisez la rentabilité de vos investissements en identifiant les meilleures opportunités grâce à nos données.',
    icon: BarChartIcon,
  },
]

const opennedItem = "Moyenne"
const accordionItems = [
  {
    "title": "Moyenne",
    "content": "La moyenne arithmétique est calculée en additionnant toutes les valeurs d'un ensemble de données et en divisant cette somme par le nombre total de valeurs. Elle donne une idée centrale de l'ensemble de données, mais peut être affectée par des valeurs extrêmes.",
    "tips": [
      "Si la moyenne est élevée, cela indique que la majorité des valeurs sont grandes.",
      "Si la moyenne est faible, cela indique que la majorité des valeurs sont petites.",
      "Une moyenne affectée par des valeurs extrêmes peut ne pas bien représenter l'ensemble des données. Dans ce cas, une médiane peut être plus pertinente."
    ]
  },
  {
    "title": "Écart-type",
    "content": "L'écart-type mesure la dispersion ou la variabilité des données par rapport à la moyenne. Il est calculé comme la racine carrée de la variance (qui est la moyenne des carrés des écarts par rapport à la moyenne).",
    "tips": [
      "Un écart-type faible signifie que les données sont proches de la moyenne.",
      "Un écart-type élevé indique que les données sont largement dispersées autour de la moyenne.",
      "Cela aide à comprendre la consistance des données : des données avec un faible écart-type sont plus homogènes."
    ]
  },
  {
    "title": "Percentiles",
    "content": "Les percentiles sont des valeurs qui divisent un ensemble de données en 100 parties égales. Ils montrent la position relative des valeurs dans un ensemble de données.",
    "tips": [
      "1er quartile (P25) : 25% des données sont inférieures à cette valeur.",
      "médiane (P50) : 50% des données sont inférieures à cette valeur. C'est la valeur centrale lorsque les données sont triées.",
      "3ème quartile (P75) : 75% des données sont inférieures à cette valeur.",
      "P25 indique où se situe le quart inférieur des données. Une valeur basse de p25 par rapport à la moyenne peut indiquer une asymétrie vers le bas.",
      "P50 (médiane) est moins affectée par les valeurs extrêmes que la moyenne et donne une meilleure idée de la tendance centrale lorsque les données sont asymétriques.",
      "P75 montre où se situe le quart supérieur des données. Une valeur élevée de p75 par rapport à la moyenne peut indiquer une asymétrie vers le haut."
    ]
  },
  {
    "title": "Valeur minimale (min)",
    "content": "La valeur minimale est la plus petite valeur dans un ensemble de données.",
    "tips": [
      "La valeur minimale peut indiquer la limite inférieure des valeurs présentes dans les données.",
      "Comparée à la moyenne, elle peut indiquer l'étendue des valeurs."
    ]
  },
  {
    "title": "Valeur maximale (max)",
    "content": "La valeur maximale est la plus grande valeur dans un ensemble de données.",
    "tips": [
      "La valeur maximale montre la limite supérieure des valeurs dans les données.",
      "Elle peut indiquer l'étendue totale lorsqu'elle est comparée à la valeur minimale."
    ]
  }
]
</script>