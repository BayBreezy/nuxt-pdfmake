<template>
  <div class="not-prose">
    <p v-if="dir" class="text-primary mb-2 font-medium capitalize md:mb-4">{{ dir }}</p>
    <h1 class="mb-3 text-3xl font-bold md:mb-4 md:text-4xl">
      {{ page?.title }}
    </h1>
    <p class="text-muted-foreground md:text-lg">
      {{ page?.description }}
    </p>
    <UiDivider class="my-8" />
  </div>
</template>

<script lang="ts" setup>
  const { page } = useContent();
  const dir = computed(() => page.value?._dir?.replace(/-/g, " "));
</script>
