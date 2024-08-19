<template>
  <caption :class="styles({ class: props.class })">
    <slot />
  </caption>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    class?: any;
  }>();

  const styles = tv({
    base: "text-muted-foreground mt-4 text-sm",
  });
</script>
