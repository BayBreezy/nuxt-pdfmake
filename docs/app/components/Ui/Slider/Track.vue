<template>
  <SliderTrack :class="styles({ class: props.class })" v-bind="forwarded">
    <slot />
  </SliderTrack>
</template>

<script lang="ts" setup>
  import { SliderTrack } from "radix-vue";
  import type { SliderTrackProps } from "radix-vue";

  const props = defineProps<
    SliderTrackProps & {
      /** Custom class(es) to add to parent element */
      class?: any;
    }
  >();
  const forwarded = reactiveOmit(props, "class");
  const styles = tv({
    base: "bg-secondary relative h-2 w-full grow overflow-hidden rounded-full",
  });
</script>
