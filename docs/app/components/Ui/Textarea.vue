<template>
  <textarea v-bind="props" v-model="localModel" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
  const props = defineProps<{
    class?: any;
    name?: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    modelValue?: string;
  }>();

  const emits = defineEmits<{
    "update:modelValue": [value: any];
  }>();

  const localModel = useVModel(props, "modelValue", emits);

  const styles = tv({
    base: "form-textarea border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:border-input focus:ring-offset-background focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
  });
</script>
