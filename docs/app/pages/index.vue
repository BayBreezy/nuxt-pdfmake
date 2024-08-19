<template>
  <div>
    <NuxtLayout name="blank">
      <ContentDoc :content="page" />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
  const { data: page } = await useAsyncData("index", () => queryContent("/").findOne());

  useSeoMeta({
    twitterTitle: page.value?.title,
    twitterDescription: page.value?.description,
    twitterCard: "summary_large_image",
    themeColor: "#3b82f6",
  });

  useHead({
    htmlAttrs: { lang: "en" },
    link: [{ rel: "icon", type: "image/png", href: "/icon.png" }],
  });
  const dir = computed(() => page.value?._dir?.replace(/-/g, " "));

  defineOgImageComponent("Docs", {
    headline: dir.value,
    title: page.value?.title,
    description: page.value?.description,
  });
</script>
