<template>
  <UiTableRow>
    <UiTableCell :colspan="colspan" :class="styles({ class: props.class })">
      <slot />
    </UiTableCell>
  </UiTableRow>
</template>

<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      colspan?: number;
      class?: any;
    }>(),
    {
      colspan: 1,
    }
  );

  const styles = tv({
    base: "text-foreground whitespace-nowrap p-4 align-middle text-sm",
  });
</script>
