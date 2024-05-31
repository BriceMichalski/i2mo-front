<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { MagnifyingGlassIcon } from '@radix-icons/vue';
import { ComboboxInput, type ComboboxInputProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<ComboboxInputProps & {
  class?: string;
  modelValue?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue || '');

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue || '';
});
</script>

<template>
  <div class="flex items-center border-b px-3" cmdk-input-wrapper>
    <MagnifyingGlassIcon class="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <ComboboxInput
      :value="inputValue"
      @input="event => inputValue = event.target.value"
      auto-focus
      :class="cn('flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', props.class)"
    />
  </div>
</template>
