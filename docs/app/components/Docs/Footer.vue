<template>
  <GlowCapture class="not-prose mt-10 py-10">
    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center md:justify-between">
      <GlowElement color="hsl(var(--primary))">
        <NuxtLink
          v-if="prev && prev.navigation != false"
          :to="prev._path"
          class="focus-visible:ring-ring focus-visible:ring-offset-background glow:border-primary dark:glow:bg-primary/10 flex flex-col gap-6 rounded-lg border p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
        >
          <div
            class="glow:border-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
          >
            <Icon
              name="heroicons:arrow-left"
              class="text-muted-foreground glow:text-primary pointer-events-none h-5 w-5"
            />
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">
              {{ prev.title }}
            </p>
            <p class="text-muted-foreground line-clamp-2 text-ellipsis text-[15px] lg:text-sm">
              {{ prev.description }}
            </p>
          </div>
        </NuxtLink>
      </GlowElement>
      <GlowElement color="hsl(var(--primary))">
        <NuxtLink
          v-if="next && next.navigation != false"
          :to="next._path"
          class="focus-visible:ring-ring focus-visible:ring-offset-background glow:border-primary dark:glow:bg-primary/10 flex flex-col gap-6 rounded-lg border p-6 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
        >
          <div
            class="glow:border-primary ml-auto flex size-10 shrink-0 items-center justify-center rounded-full border"
          >
            <Icon
              name="heroicons:arrow-right"
              class="text-muted-foreground glow:text-primary pointer-events-none h-5 w-5"
            />
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-medium">
              {{ next.title }}
            </p>
            <p class="text-muted-foreground line-clamp-2 text-ellipsis text-[15px] lg:text-sm">
              {{ next.description }}
            </p>
          </div>
        </NuxtLink>
      </GlowElement>
    </div>
  </GlowCapture>
</template>

<script lang="ts" setup>
  const { prev, next } = useContent();
</script>
