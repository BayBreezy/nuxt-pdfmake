<template>
  <ToggleRoot v-bind="forwarded" :class="styles({ variant, size, class: props.class })">
    <slot />
  </ToggleRoot>
</template>

<script lang="ts" setup>
  import { Toggle as ToggleRoot, useForwardPropsEmits } from "radix-vue";
  import type { ToggleEmits, ToggleProps } from "radix-vue";

  const props = defineProps<
    ToggleProps & {
      class?: any;
      variant?: Props["variant"];
      size?: Props["size"];
    }
  >();

  const emits = defineEmits<ToggleEmits>();
  const forwarded = useForwardPropsEmits(reactiveOmit(props, "class", "variant", "size"), emits);

  type Props = VariantProps<typeof styles>;

  const styles = tv({
    base: "ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:ring-ring data-[state=on]:bg-accent data-[state=on]:text-accent-foreground inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:text-sm",
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-input hover:bg-accent hover:text-accent-foreground border bg-transparent",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });
</script>
