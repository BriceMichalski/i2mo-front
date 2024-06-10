<template>
  <div class="md:hidden">
    <VPImage
      alt="Dashboard"
      width="1280"
      height="1214" class="block" :image="{
        dark: '/examples/dashboard-dark.png',
        light: '/examples/dashboard-light.png',
      }"
    />
  </div>

  <div class="hidden flex-col md:flex z-50">
    <div class="inset-x-0 top-0 z-50">
      <div class="flex h-16 items-center px-4">
        <TeamSwitcher />
        <MainNav class="mx-6" />
        <div class="ml-auto flex items-center space-x-4">
          <Search />
          <!-- <UserNav /> -->
        </div>
      </div>
    </div>
  </div>
</template>