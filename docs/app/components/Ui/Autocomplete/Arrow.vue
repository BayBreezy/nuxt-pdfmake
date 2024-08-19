<template>
  <ComboboxArrow v-bind="props" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
  import { ComboboxArrow } from "radix-vue";
  import type { ComboboxArrowProps } from "radix-vue";

  const props = defineProps<
    ComboboxArrowProps & {
      class?: any;
    }
  >();

  const styles = tv({
    base: "bg-muted rotate-45 border",
  });
</script>
