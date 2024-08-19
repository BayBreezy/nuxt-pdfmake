<template>
  <DateFieldRoot
    v-slot="{ segments }"
    v-bind="props"
    v-model="localModel"
    :class="styles({ class: props.class })"
  >
    <template v-for="item in segments" :key="item.part">
      <DateFieldInput
        v-if="item.part === 'literal'"
        :part="item.part"
        class="text-muted-foreground inline-flex items-center justify-center"
      >
        <Icon v-if="separatorIcon" :name="separatorIcon" class="text-muted-foreground" />
        <span v-else-if="separator" class="text-muted-foreground mx-1">{{ separator }}</span>
      </DateFieldInput>
      <DateFieldInput
        v-else
        :part="item.part"
        class="focus:ring-ring aria-[valuetext=Empty]:text-muted-foreground inline-flex cursor-text items-center rounded px-1 transition focus:outline-none focus:ring-1"
      >
        {{ item.value }}
      </DateFieldInput>
    </template>
  </DateFieldRoot>
</template>

<script lang="ts" setup>
  import { DateFieldInput, DateFieldRoot } from "radix-vue";
  import type { DateValue } from "@internationalized/date";
  import type { DateFieldRootProps } from "radix-vue";

  const props = withDefaults(
    defineProps<
      DateFieldRootProps & {
        class?: any;
        separator?: string;
        separatorIcon?: string;
      }
    >(),
    {
      separator: "/",
    }
  );
  const localModel = defineModel<DateValue>();

  const styles = tv({
    base: "border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring data-[invalid]:border-destructive h-10 w-full rounded-md border px-3 py-2 text-[16px] file:border-0 file:bg-transparent file:text-sm file:font-medium file:hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 sm:text-sm",
  });
</script>
