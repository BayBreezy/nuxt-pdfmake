<template>
  <div class="flex flex-col">
    <MainNav />
    <UiContainer
      class="grid grow grid-cols-1 md:grid-cols-[270px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10"
    >
      <aside class="sticky top-16 z-20 hidden h-[calc(100dvh-65px)] md:block">
        <UiScrollArea as="aside" class="h-[calc(100dvh-65px)] border-r px-2 py-5">
          <DocsNavlink :links="navigation" />
        </UiScrollArea>
      </aside>
      <div class="xl:grid xl:grid-cols-[1fr_250px] xl:gap-5">
        <main
          class="prose dark:prose-invert lg:prose-base prose-headings:scroll-mt-16 prose-headings:tracking-tight prose-h2:mt-6 prose-h2:border-b prose-h2:pb-3 first:prose-h2:mt-10 prose-a:decoration-primary prose-a:decoration-wavy prose-a:underline-offset-2 hover:prose-a:text-primary lg:prose-pre:text-base container mx-auto w-full min-w-0 max-w-none py-5"
        >
          <DocsPageHeader />
          <slot />
          <DocsFooter />
        </main>
        <aside
          v-if="toc && toc.links.length && toc.links"
          class="sticky top-16 hidden h-[calc(100dvh-65px)] overflow-y-auto px-3 py-5 xl:block"
        >
          <p class="mb-4 flex items-center gap-3 text-sm font-semibold">On this page</p>
          <nav>
            <DocsToc :set-active="setActive" :active-id="activeId" :links="toc.links" />
          </nav>
        </aside>
      </div>
    </UiContainer>
  </div>
</template>

<script lang="ts" setup>
  import { _colors } from "#tailwind-config/theme";
  import { useActiveScroll } from "vue-use-active-scroll";

  const { toc, navigation, page } = useContent();

  const ids = computed(() =>
    toc.value?.links?.flatMap(({ id, children = [] }: any) => [
      id,
      ...children.map(({ id }: any) => id), // Flatten any nested link
    ])
  );
  const { setActive, activeId } = useActiveScroll(ids, {
    replaceHash: true,
    overlayHeight: 100,
  });

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
