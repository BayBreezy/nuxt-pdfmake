<template>
  <DialogOverlay :class="styles({ class: props.class })" v-bind="forwarded" />
</template>

<script lang="ts" setup>
  import { DialogOverlay } from "radix-vue";
  import type { DialogOverlayProps } from "radix-vue";

  const props = defineProps<
    DialogOverlayProps & {
      /** Custom class(es) to add to parent element */
      class?: any;
    }
  >();
  const forwarded = reactiveOmit(props, "class");
  const styles = tv({
    base: "bg-background/80 data-[state=closed]:animate-fadeOut data-[state=open]:animate-fadeIn fixed inset-0 z-50 backdrop-blur-sm",
  });
</script>
