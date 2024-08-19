<template>
  <NumberFieldInput v-bind="forwarded" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
  import { NumberFieldInput, useForwardProps } from "radix-vue";
  import type { NumberFieldInputProps } from "radix-vue";

  const props = withDefaults(
    defineProps<
      NumberFieldInputProps & {
        class?: any;
      }
    >(),
    {}
  );

  const forwarded = useForwardProps(reactiveOmit(props, "class"));

  const styles = tv({
    base: "placeholder:text-muted-foreground/80 h-full w-full grow bg-transparent text-center text-base focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
  });
</script>
