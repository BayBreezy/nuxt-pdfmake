<template>
  <UiSheet v-model:open="localModel">
    <UiSheetContent class="p-1">
      <template #content>
        <UiSheetTitle title="Mobile menu" class="sr-only" />
        <UiSheetDescription description="A list of navigation items for mobile" class="sr-only" />
        <UiScrollArea class="h-[calc(100dvh-20px)] w-full p-5">
          <div class="bg-background sticky top-0 mb-3 w-full">
            <div class="flex items-center gap-3.5">
              <div class="bg-foreground/10 flex h-8 w-8 items-center justify-center rounded">
                <img src="/icon.png" alt="Logo" class="size-9 rounded-lg object-contain" />
              </div>
              <p class="text-xl font-bold">UI Doc</p>
              <UiSheetClose class="ml-auto">
                <Icon name="heroicons:x-mark" />
              </UiSheetClose>
            </div>
            <UiSeparator class="mt-4" />
          </div>
          <DocsNavlink :links="navigation" />
        </UiScrollArea>
      </template>
    </UiSheetContent>
  </UiSheet>
</template>

<script lang="ts" setup>
  const { navigation } = useContent();

  const localModel = defineModel<boolean>({ default: false });
</script>
