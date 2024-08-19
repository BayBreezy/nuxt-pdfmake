<template>
  <!-- eslint-disable-next-line vue/html-self-closing -->
  <input ref="inputRef" type="text" :class="styles({ class: props.class })" v-bind="props" />
</template>

<script lang="ts" setup>
  import { defu } from "defu";
  import { useCurrencyInput } from "vue-currency-input";
  import type { CurrencyInputOptions } from "vue-currency-input";

  const props = defineProps<{
    class?: any;
    id?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    modelValue?: any;
    options?: CurrencyInputOptions;
  }>();

  const { inputRef } = useCurrencyInput(
    defu({}, props.options, {
      currency: "USD",
      locale: "en-US",
      hideCurrencySymbolOnFocus: false,
      hideGroupingSeparatorOnFocus: false,
    })
  );

  const styles = tv({
    base: "border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-[16px] file:border-0 file:bg-transparent file:text-sm file:font-medium file:hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
  });
</script>
