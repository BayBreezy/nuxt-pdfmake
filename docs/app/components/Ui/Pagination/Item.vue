<template>
  <PaginationListItem v-bind="props">
    <slot>
      <UiButton
        variant="outline"
        size="icon-sm"
        class="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:border-transparent"
      >
        {{ value }}
      </UiButton>
    </slot>
  </PaginationListItem>
</template>

<script lang="ts" setup>
  import { PaginationListItem } from "radix-vue";
  import type { PaginationListItemProps } from "radix-vue";

  const props = defineProps<PaginationListItemProps>();
</script>
