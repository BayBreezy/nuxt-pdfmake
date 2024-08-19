<template>
  <component
    :is="elementType"
    :to="to"
    :href="href"
    :disabled="disabled"
    :class="badgeVariants({ disabled, variant, class: props.class })"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
  const badgeVariants = tv({
    base: "focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
        outline: "text-foreground",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  type BadgeProps = VariantProps<typeof badgeVariants>;

  const props = defineProps<{
    class?: any;
    variant?: BadgeProps["variant"];
    onClick?: () => void;
    to?: string;
    href?: string;
    disabled?: boolean;
    tag?: string;
  }>();

  const elementType = computed(() => {
    if (props.tag) return props.tag;
    if (props.href || props.to) return resolveComponent("NuxtLink");
    return props.tag || "div";
  });
</script>
