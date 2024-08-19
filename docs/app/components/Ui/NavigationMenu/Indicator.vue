<template>
  <NavigationMenuIndicator v-bind="forwarded" :class="styles({ class: props.class })">
    <slot />
    <div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
  </NavigationMenuIndicator>
</template>

<script lang="ts" setup>
  import { NavigationMenuIndicator } from "radix-vue";
  import type { NavigationMenuIndicatorProps } from "radix-vue";

  const props = defineProps<
    NavigationMenuIndicatorProps & {
      /** Custom class(es) to add to the parent */
      class?: any;
    }
  >();
  const forwarded = reactiveOmit(props, "class");
  const styles = tv({
    base: "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
  });
</script>
