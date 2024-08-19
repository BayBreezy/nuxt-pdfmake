<template>
  <NavigationMenuTrigger v-bind="forwarded" :class="styles({ class: props.class })">
    <slot>{{ title }}</slot>
    <slot name="icon">
      <Icon
        :name="icon || 'lucide:chevron-down'"
        class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </slot>
  </NavigationMenuTrigger>
</template>

<script lang="ts" setup>
  import { NavigationMenuTrigger } from "radix-vue";
  import type { NavigationMenuTriggerProps } from "radix-vue";

  const props = defineProps<
    NavigationMenuTriggerProps & {
      /** Custom class(es) to add to the parent */
      class?: any;
      /** Icon to show */
      icon?: string;
      /** Title to show */
      title?: string;
    }
  >();
  const forwarded = reactiveOmit(props, "class", "icon", "title");
  const styles = tv({
    base: "bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
  });
</script>
