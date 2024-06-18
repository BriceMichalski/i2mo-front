<template>

<nav class="bg-white dark:bg-gray-900  w-full z-50 top-0 start-0 h-[60px] border-gray-50 border-b " >
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 z-50">
    <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse z-50">
        <img src="/img/logo.png" alt="Logo" class="h-8 w-28 mr-2">
    </a>
    <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse z-50">
        <Search />
        <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="true">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
      </button>
    </div>

    <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 z-50" id="navbar-sticky">
      <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <a href="/map" class="block py-2 px-3 text-gray-700 rounded  hover:text-primary md:p-0  bg-transparent">Carte</a>
        </li>
        <li>
          <a href="/about" class="block py-2 px-3 text-gray-700 rounded  hover:text-primary md:p-0  bg-transparent">A propos</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script setup>
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'

// initialize components based on data attribute selectors
onMounted(() => {
    initFlowbite();
})
</script>