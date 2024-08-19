<template>
  <div class="h-[700px] w-full">
    <iframe v-if="pdfLink" :src="pdfLink" class="h-full w-full" />
  </div>
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
          {
            qr: "Visit UI Thing at https://ui-thing.behonbaker.com/getting-started/introduction",
            margin: bigmargin,
          },
          { text: "Colored QR Code", margin: smallmargin },
          {
            qr: "Visit BayBreezy's Github at https://github.com/BayBreezy",
            foreground: "red",
            background: "yellow",
            margin: bigmargin,
          },
          { text: "Custom Size", margin: smallmargin },
          { qr: "Visit my portfolio at https://behonbaker.com", fit: 200 },
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
