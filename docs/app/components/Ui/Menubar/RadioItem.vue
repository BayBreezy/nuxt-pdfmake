<template>
  <MenubarRadioItem v-bind="forwarded" :class="styles({ class: props.class })">
    <span class="text-primary absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <UiMenubarItemIndicator>
        <Icon v-if="icon" :name="icon" class="h-4 w-4" />
        <Icon v-else name="ph:circle-fill" class="h-2 w-2" />
      </UiMenubarItemIndicator>
    </span>
    <slot>{{ title }}</slot>
  </MenubarRadioItem>
</template>

<script lang="ts" setup>
  import { MenubarRadioItem, useForwardPropsEmits } from "radix-vue";
  import type { MenubarRadioItemEmits, MenubarRadioItemProps } from "radix-vue";

  const props = defineProps<
    MenubarRadioItemProps & {
      /** Custom class(es) to add to the parent */
      class?: any;
      /** The icon to display */
      icon?: string;
      /** The title of the component */
      title?: string;
    }
  >();

  const emits = defineEmits<MenubarRadioItemEmits>();
  const forwarded = useForwardPropsEmits(reactiveOmit(props, "class", "icon", "title"), emits);

  const styles = tv({
    base: "focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  });
</script>
