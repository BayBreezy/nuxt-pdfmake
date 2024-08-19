<template>
  <UiContainer class="flex flex-col items-center justify-center py-16">
    <p class="text-primary text-center text-sm font-semibold">{{ feature.headline }}</p>
    <h1 class="mt-6 text-pretty text-center text-3xl font-semibold tracking-tight lg:text-4xl">
      {{ feature?.title }}
    </h1>
    <p
      v-if="feature?.description"
      class="text-muted-foreground mx-auto mt-5 max-w-[700px] text-pretty text-center text-lg"
    >
      {{ feature?.description }}
    </p>

    <GlowCapture class="pb-10 pt-12" :size="600">
      <div
        v-if="feature.items && feature.items.length"
        class="mx-auto grid max-w-[900px] grid-cols-1 gap-10 md:grid-cols-2"
      >
        <template v-for="(item, i) in feature.items" :key="i">
          <GlowElement color="hsl(var(--primary))">
            <UiCard class="glow:border-primary dark:glow:bg-primary/10 group rounded-xl">
              <UiCardContent>
                <UiFancyIcon class="pointer-events-none bg-transparent" :icon="item.icon" />
                <UiCardTitle class="mb-3 mt-6 text-xl font-semibold">{{ item.title }}</UiCardTitle>
                <UiCardDescription v-if="item.description" class="text-base">{{
                  item.description
                }}</UiCardDescription>
                <ul
                  v-if="item.list && item.list.length"
                  class="text-muted-foreground mt-4 flex flex-col gap-3"
                >
                  <template v-for="l in item.list" :key="l">
                    <li class="flex items-center gap-2">
                      <Icon name="heroicons:check-badge" class="size-5 text-green-500" />
                      <span>{{ l }} </span>
                    </li>
                  </template>
                </ul>
              </UiCardContent>
            </UiCard>
          </GlowElement>
        </template>
      </div>
    </GlowCapture>
  </UiContainer>
</template>

<script lang="ts">
  export type HomeHero = {
    headline?: string;
    title: string;
    description: string;
    items: {
      title: string;
      description?: string;
      icon: string;
      list?: string[];
    }[];
  };
</script>

<script lang="ts" setup>
  const { page } = useContent();
  const feature = computed<HomeHero>(() => page?.value?.feature);
</script>
