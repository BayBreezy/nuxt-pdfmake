<template>
  <Primitive :class="styles({ class: props.class })" v-bind="forwarded">
    <slot>{{ subtitle }}</slot>
  </Primitive>
</template>

<script lang="ts" setup>
  import { Primitive } from "radix-vue";
  import type { PrimitiveProps } from "radix-vue";

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        /** Custom class(es) to add to the parent */
        class?: any;
        /** The subtitle of the component */
        subtitle?: string;
      }
    >(),
    {
      as: "p",
    }
  );
  const forwarded = reactiveOmit(props, "class", "subtitle");
  const styles = tv({
    base: "text-muted-foreground text-sm",
  });
</script>
