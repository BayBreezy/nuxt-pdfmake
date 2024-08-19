<template>
  <UiNavbar class="shrink-0" sticky>
    <UiContainer class="flex h-16 items-center justify-between">
      <div class="flex items-center gap-3">
        <UiButton
          size="icon-sm"
          variant="outline"
          class="size-9 md:hidden"
          @click="mobileNav = true"
          ><Icon name="heroicons:bars-2" class="h-4 w-4" />
        </UiButton>
        <NuxtLink class="text-lg font-semibold" to="/">Nuxt PDFMake</NuxtLink>
      </div>
      <div class="flex items-center gap-2">
        <UiButton
          size="sm"
          class="text-muted-foreground mr-2 hidden min-w-[300px] font-normal md:flex"
          variant="outline"
          @click="searchOpen = true"
        >
          <Icon class="size-5" name="heroicons:magnifying-glass" />
          Search...
          <UiKbd class="ml-auto">{{ metaSymbol }}+K</UiKbd>
        </UiButton>
        <DocsSearch v-model="searchOpen" />
        <UiButton
          size="icon"
          class="text-muted-foreground md:hidden"
          variant="ghost"
          @click="searchOpen = true"
        >
          <Icon name="lucide:search" class="size-5" />
        </UiButton>
        <UiButton
          to="https://github.com/BayBreezy/nuxt-pdfmake"
          target="_blank"
          class="size-9"
          variant="ghost"
          size="icon"
          ><Icon name="radix-icons:github-logo" class="size-5"
        /></UiButton>
        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <UiButton class="size-9" variant="ghost" size="icon">
              <ClientOnly>
                <Icon :name="currentIcon || 'heroicons:sun'" class="size-5" />
              </ClientOnly>
            </UiButton>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent align="end" :side-offset="5">
            <UiDropdownMenuItem
              v-for="(m, i) in modes"
              :key="i"
              class="cursor-pointer"
              :icon="m.icon"
              :title="m.title"
              @click="setTheme(m.value)"
            />
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </div>
    </UiContainer>
    <MobileNav v-model="mobileNav" />
  </UiNavbar>
</template>

<script lang="ts" setup>
  const mobileNav = ref(false);
  const modes = [
    { icon: "heroicons:sun", title: "Light", value: "light" },
    { icon: "heroicons:moon", title: "Dark", value: "dark" },
    { icon: "heroicons:computer-desktop", title: "System", value: "system" },
  ];

  const colorMode = useColorMode();
  const setTheme = (val: string) => {
    colorMode.preference = val;
  };

  const currentIcon = computed(() => {
    return modes.find((m) => m.value === colorMode?.preference)?.icon;
  });

  const searchOpen = ref(false);

  const { metaSymbol } = useShortcuts();

  defineShortcuts({
    meta_k: () => {
      searchOpen.value = !searchOpen.value;
    },
  });
</script>
