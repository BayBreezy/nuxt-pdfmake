<template>
  <TabsList :class="styles({ pill, class: props.class })" v-bind="forwarded">
    <slot />
  </TabsList>
</template>

<script lang="ts" setup>
  import { TabsList } from "radix-vue";
  import type { TabsListProps } from "radix-vue";

  const props = withDefaults(
    defineProps<
      TabsListProps & {
        /** Custom class(es) to add to parent element */
        class?: any;
        pill?: boolean;
      }
    >(),
    { pill: true }
  );
  const forwarded = reactiveOmit(props, "class");
  const styles = tv({
    base: "text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1",
    variants: {
      pill: {
        true: "bg-muted",
        false: "",
      },
    },
  });
</script>
