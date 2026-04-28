<template>
  <div>
    <UiNavbar sticky>
      <UiContainer class="flex h-14 items-center justify-between">
        <div class="flex items-center gap-4">
          <p class="font-semibold">Nuxt PDFMake</p>
          <nav class="text-muted-foreground flex items-center gap-2 text-sm">
            <NuxtLink to="/" class="hover:text-foreground transition-colors">Examples</NuxtLink>
            <span>/</span>
            <NuxtLink to="/editor" class="hover:text-foreground transition-colors"
              >Live Editor</NuxtLink
            >
          </nav>
        </div>
        <UiButton size="icon-sm" variant="ghost" @click="toggleMode">
          <icon class="size-5" name="lucide:sun-medium" />
        </UiButton>
      </UiContainer>
    </UiNavbar>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Nuxt PDFMake Playground" });
const colorMode = useColorMode();
const toggleMode = () => {
  colorMode.preference = colorMode.value === "light" ? "dark" : "light";
};
</script>
