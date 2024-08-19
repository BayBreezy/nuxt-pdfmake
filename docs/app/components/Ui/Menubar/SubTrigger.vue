<template>
  <MenubarSubTrigger v-bind="forwarded" :class="styles({ inset, class: props.class })">
    <slot>
      <Icon v-if="icon" :name="icon" class="h-4 w-4" />
      <span v-if="title">{{ title }}</span>
    </slot>
    <Icon
      class="text-muted-foreground ml-auto h-4 w-4"
      :name="trailingIcon || 'lucide:chevron-right'"
    />
  </MenubarSubTrigger>
</template>

<script lang="ts" setup>
  import { MenubarSubTrigger } from "radix-vue";
  import type { MenubarSubTriggerProps } from "radix-vue";

  const props = defineProps<
    MenubarSubTriggerProps & {
      class?: any;
      inset?: boolean;
      icon?: string;
      title?: string;
      trailingIcon?: string;
    }
  >();
  const forwarded = reactiveOmit(props, "class", "inset", "icon", "title", "trailingIcon");
  const styles = tv({
    base: "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none",
    variants: {
      inset: {
        true: "pl-8",
      },
    },
  });
</script>
