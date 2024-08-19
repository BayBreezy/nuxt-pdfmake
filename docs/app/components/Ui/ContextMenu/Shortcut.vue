<template>
  <Primitive :as="as || 'span'" :as-child="asChild" :class="styles({ class: props.class })">
    <slot />
  </Primitive>
</template>

<script lang="ts" setup>
  import { Primitive } from "radix-vue";
  import type { PrimitiveProps } from "radix-vue";

  const props = defineProps<
    PrimitiveProps & {
      class?: any;
    }
  >();

  const styles = tv({
    base: "text-muted-foreground ml-auto text-xs tracking-widest",
  });
</script>
