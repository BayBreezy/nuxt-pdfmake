<template>
  <ComboboxLabel :class="styles({ class: props.class })" v-bind="forwarded">
    <slot>{{ label }}</slot>
  </ComboboxLabel>
</template>

<script lang="ts" setup>
  import { ComboboxLabel } from "radix-vue";
  import type { ComboboxLabelProps } from "radix-vue";

  const props = defineProps<
    ComboboxLabelProps & {
      /**
       * Class(es) to pass to the ComboboxLabel component.
       */
      class?: any;
      /**
       * The label to display.
       */
      label?: any;
    }
  >();
  const forwarded = reactiveOmit(props, "class", "label");
  const styles = tv({
    base: "text-muted-foreground px-2 py-1.5 text-xs font-medium",
  });
</script>
