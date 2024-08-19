<template>
  <UiSheetPortal :to="to">
    <slot name="overlay">
      <UiSheetOverlay />
    </slot>
    <DialogContent
      :class="styles({ side, class: props.class })"
      v-bind="{ ...forwarded, ...$attrs }"
    >
      <slot>
        <slot name="header">
          <UiSheetHeader>
            <slot name="title">
              <UiSheetTitle v-if="title" :title="title" />
            </slot>
            <slot name="description">
              <UiSheetDescription v-if="description" :description="description" />
            </slot>
          </UiSheetHeader>
        </slot>
        <slot name="content" />
        <slot name="footer" />
      </slot>
      <slot name="close">
        <UiSheetClose :icon="icon" />
      </slot>
    </DialogContent>
  </UiSheetPortal>
</template>

<script lang="ts" setup>
  import { DialogContent, useForwardPropsEmits } from "radix-vue";
  import type { DialogContentEmits, DialogContentProps } from "radix-vue";

  defineOptions({ inheritAttrs: false });

  const props = defineProps<
    DialogContentProps & {
      icon?: string;
      title?: string;
      description?: string;
      class?: any;
      side?: VariantProps<typeof styles>["side"];
      to?: string | HTMLElement;
    }
  >();
  const emits = defineEmits<DialogContentEmits>();
  const forwarded = useForwardPropsEmits(
    reactiveOmit(props, "icon", "title", "description", "class", "to", "side"),
    emits
  );

  const styles = tv({
    base: "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
    variants: {
      side: {
        top: "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b",
        bottom:
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t",
        left: "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        right:
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "left",
    },
  });
</script>
