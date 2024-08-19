<template>
  <RadioGroupItem v-bind="forwarded" :class="styles({ class: props.class })">
    <slot>
      <UiRadioGroupIndicator :icon="props.icon" />
    </slot>
  </RadioGroupItem>
</template>

<script lang="ts" setup>
  import { RadioGroupItem } from "radix-vue";
  import type { RadioGroupItemProps } from "radix-vue";

  const props = defineProps<
    RadioGroupItemProps & {
      /** Class to apply to the item */
      class?: any;
      /** Icon to show */
      icon?: string;
    }
  >();
  const forwarded = reactiveOmit(props, "class", "icon");
  const styles = tv({
    base: "border-primary text-primary ring-offset-background focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  });
</script>
