<template>
  <div :class="styles({ class: props.class })">
    <template v-for="(item, i) in items" :key="i">
      <div class="flex items-center gap-3">
        <div class="flex cursor-pointer items-center gap-2">
          <slot name="crumbIcon" :item="item" :index="i">
            <Icon
              v-if="item.icon"
              :name="item.icon"
              :class="[!isNotLastItem(i) && 'text-primary']"
            />
          </slot>
          <slot :item="item" :is-not-last-item="isNotLastItem" :index="i" name="link">
            <NuxtLink
              v-if="item.label"
              :to="!item?.disabled ? item.link : ''"
              :class="[
                isNotLastItem(i)
                  ? 'text-muted-foreground hover:underline'
                  : 'text-primary font-semibold',
              ]"
              class="text-foreground text-sm"
              @click="item?.click?.()"
              >{{ item.label }}</NuxtLink
            >
          </slot>
        </div>
        <slot name="separator" :item="item" :index="i">
          <Icon v-if="isNotLastItem(i)" :name="separator" class="text-muted-foreground h-3 w-3" />
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  export interface Crumbs {
    label: string;
    icon?: string;
    link?: string;
    disabled?: boolean;

    click?: Function;
  }
  const props = withDefaults(
    defineProps<{
      /**
       * The items to display in the breadcrumbs.
       */
      items?: Crumbs[];
      /**
       * The separator to use between each breadcrumb.
       */
      separator?: string;
      class?: any;
    }>(),
    {
      separator: "heroicons:chevron-right",
      items: () => [],
      class: undefined,
    }
  );

  const isNotLastItem = (index: number) => {
    return index !== props?.items?.length - 1;
  };

  const styles = tv({
    base: "flex w-full items-center gap-4",
  });
</script>
