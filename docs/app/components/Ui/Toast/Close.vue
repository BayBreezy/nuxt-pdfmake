<template>
  <ToastClose :class="styles({ class: props.class })" v-bind="forwarded">
    <slot>
      <Icon :name="icon || 'lucide:x'" class="h-4 w-4" />
    </slot>
  </ToastClose>
</template>

<script lang="ts" setup>
  import { ToastClose } from "radix-vue";
  import type { ToastCloseProps } from "radix-vue";

  const props = defineProps<
    ToastCloseProps & {
      /**
       * Custom class names to add to the button.
       */
      class?: any;
      /**
       * The icon to render.
       */
      icon?: string;
    }
  >();
  const forwarded = reactiveOmit(props, "class", "icon");
  const styles = tv({
    base: "text-foreground/50 hover:text-foreground focus-visible:ring-ring absolute right-2 top-2 inline-flex items-center justify-center rounded-md p-1 opacity-50 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
  });
</script>
