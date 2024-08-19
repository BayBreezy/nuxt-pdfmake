<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtPwaManifest />
    <ConfigProvider :use-id="useIdFunction">
      <NuxtPage />
    </ConfigProvider>
    <UiVueSonner />
  </div>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from "radix-vue";

  const useIdFunction = () => useId();
</script>
