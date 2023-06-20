<template>
  <main class="w-full h-[700px]">
    <iframe :src="pdfLink" class="w-full h-full" />
  </main>
</template>

<script setup lang="ts">
const pdfLink = ref();
const smallmargin = [0, 0, 0, 10] as any;
const bigmargin = [0, 0, 0, 20] as any;

const loadPdf = () => {
  usePDFMake()
    .createPdf({
      content: [
        { text: "Basic QR Usage", margin: smallmargin },
        { qr: "text in QR", margin: bigmargin },
        { text: "Colored QR Code", margin: smallmargin },
        {
          qr: "text in QR",
          foreground: "red",
          background: "yellow",
          margin: bigmargin,
        },
        { text: "Custom Size", margin: smallmargin },
        { qr: "text in QR", fit: 200 },
      ],
    })
    .getDataUrl((dataUrl: any) => {
      pdfLink.value = dataUrl;
    });
};
onMounted(() => {
  loadPdf();
});
</script>
