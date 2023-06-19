<template>
  <main class="w-full divide-x flex justify-center">
    <div class="w-1/2 h-screen bg-red-50"></div>
    <div class="w-1/2 h-screen bg-blue-50">
      <VuePDF :pdf="pdfLink" v-if="pdfLink" fit-parent />
    </div>
  </main>
</template>

<script setup lang="ts">
import { VuePDF, usePDF } from "@tato30/vue-pdf";

const { $pdfMake: pdf } = useNuxtApp();
const pdfLink = ref("");

const loadPdf = () => {
  pdf
    .createPdf({
      content: [
        "First paragraph",
        "Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines",
      ],
    })
    .getDataUrl((dataUrl) => {
      pdfLink.value = dataUrl;
    });
};
onMounted(() => {
  loadPdf();
});
</script>
