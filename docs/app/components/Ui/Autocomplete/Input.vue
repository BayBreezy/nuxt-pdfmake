<template>
  <ComboboxInput v-bind="props" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
  import { ComboboxInput } from "radix-vue";
  import type { ComboboxInputProps } from "radix-vue";

  const props = defineProps<
    ComboboxInputProps & {
      placeholder?: string;
      class?: any;
    }
  >();

  const styles = tv({
    base: "bg-background placeholder:text-muted-foreground size-full grow rounded-md focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
  });
</script>
