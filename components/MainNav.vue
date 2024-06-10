<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>

<template>
  <nav
    :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')"
  >
    <a
      href="/"
      class="text-sm font-medium transition-colors hover:text-primary"
    >
      <img src="/img/logo.png" alt="Logo" class="h-8 w-28 mr-2">
    </a>

    <a
      href="/map"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
        Map
    </a>
    <!-- <a
      href="/examples/dashboard"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
        Mes biens
    </a>
    <a
      href="/examples/dashboard"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      Settings
    </a> -->
    <a
      href="/about"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
        A propos
    </a>
  </nav>
</template>