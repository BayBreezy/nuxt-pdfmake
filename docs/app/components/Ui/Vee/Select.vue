<template>
  <div class="w-full">
    <UiLabel v-if="label" :for="inputId" :class="[errorMessage && 'text-destructive', 'mb-2']">
      <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
    </UiLabel>
    <div class="relative">
      <slot name="icon">
        <span v-if="hasIcon" lass="absolute inset-y-0 left-3 flex items-center justify-center">
          <Icon v-if="icon" :name="icon" class="text-muted-foreground h-4 w-4" />
        </span>
      </slot>
      <UiNativeSelect
        :id="inputId"
        v-model="value"
        :required="required"
        :trailing-icon="trailingIcon"
        :name="name"
        v-bind="$attrs"
        :class="[hasIcon && 'pl-9']"
        @blur="handleBlur"
      >
        <slot />
      </UiNativeSelect>
    </div>
    <TransitionSlide group tag="div">
      <p v-if="hint && !errorMessage" key="hint" class="text-muted-foreground mt-1.5 text-sm">
        {{ hint }}
      </p>

      <p v-if="errorMessage" key="errorMessage" class="text-destructive mt-1.5 text-sm">
        {{ errorMessage }}
      </p>
    </TransitionSlide>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    label?: string;
    icon?: string;
    hint?: string;
    modelValue?: string;
    name?: string;
    id?: string;
    rules?: any;
    validateOnMount?: boolean;
    type?: string;
    trailingIcon?: string;
    required?: boolean;
  }>();

  const inputId = props.id || useId();

  const hasIcon = computed(() => Boolean(props.icon) || Boolean(useSlots().icon));

  const { errorMessage, value, handleBlur } = useField(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
  });
</script>
