<template>
  <PinInputInput v-bind="forwarded" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
  import { PinInputInput } from "radix-vue";
  import type { PinInputInputProps } from "radix-vue";

  const props = defineProps<
    PinInputInputProps & {
      class?: any;
    }
  >();
  const forwarded = reactiveOmit(props, "class");
  const styles = tv({
    base: "border-input bg-background focus-visible:ring-ring focus-visible:ring-offset-background h-10 w-10 rounded-md border p-1 text-center text-base font-medium placeholder:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
  });
</script>
