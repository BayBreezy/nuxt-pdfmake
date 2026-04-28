<template>
  <main class="h-175 w-full">
    <UiIframeLazy v-if="pdfLink" :src="pdfLink" class="h-full w-full" />
  </main>
</template>

<script setup lang="ts">
const pdfLink = ref<string | null>(null);

const loadPdf = async () => {
  const pdfMake = usePDFMake();
  if (!pdfMake) return;

  pdfLink.value = await pdfMake
    .createPdf({
      info: {
        title: "Contact QR Sheet",
        author: "Acme Operations Group",
        creator: "Nuxt pdfMake",
        producer: "pdfmake",
      },
      pageMargins: [40, 46, 40, 42],
      content: [
        {
          columns: [
            [
              { text: "Contact QR Sheet", style: "title" },
              { text: "Scan to connect — Acme Operations Group", style: "subtitle" },
            ],
            {
              text: `Generated ${new Date().toLocaleDateString()}`,
              style: "meta",
              alignment: "right",
            },
          ],
          marginBottom: 24,
        },
        {
          columns: [
            {
              width: "*",
              stack: [
                { text: "Website", style: "cardLabel" },
                {
                  qr: "https://nuxt-pdfmake.behonbaker.com",
                  fit: 120,
                  margin: [0, 8, 0, 6],
                },
                { text: "nuxt-pdfmake.behonbaker.com", style: "cardUrl" },
              ],
              style: "qrCard",
            },
            {
              width: "*",
              stack: [
                { text: "GitHub", style: "cardLabel" },
                {
                  qr: "https://github.com/BayBreezy/nuxt-pdfmake",
                  fit: 120,
                  foreground: "#1d293d",
                  margin: [0, 8, 0, 6],
                },
                { text: "github.com/BayBreezy/nuxt-pdfmake", style: "cardUrl" },
              ],
              style: "qrCard",
            },
            {
              width: "*",
              stack: [
                { text: "Portfolio", style: "cardLabel" },
                {
                  qr: "https://behonbaker.com",
                  fit: 120,
                  foreground: "#0369a1",
                  margin: [0, 8, 0, 6],
                },
                { text: "behonbaker.com", style: "cardUrl" },
              ],
              style: "qrCard",
            },
          ],
          columnGap: 12,
          marginBottom: 24,
        },
        { text: "QR Code Customization Options", style: "sectionTitle" },
        {
          text: "pdfMake supports foreground/background colors, error correction levels, and custom fit sizes.",
          style: "bodyText",
          marginBottom: 12,
        },
        {
          columns: [
            {
              width: "*",
              stack: [
                { text: "Error Correction: High", style: "optionLabel" },
                {
                  qr: "https://nuxt-pdfmake.behonbaker.com",
                  fit: 90,
                  eccLevel: "H",
                  margin: [0, 6, 0, 0],
                },
              ],
              style: "optionCard",
            },
            {
              width: "*",
              stack: [
                { text: "Custom Colors", style: "optionLabel" },
                {
                  qr: "https://nuxt-pdfmake.behonbaker.com",
                  fit: 90,
                  foreground: "#16a34a",
                  background: "#f0fdf4",
                  margin: [0, 6, 0, 0],
                },
              ],
              style: "optionCard",
            },
            {
              width: "*",
              stack: [
                { text: "Inverted Colors", style: "optionLabel" },
                {
                  qr: "https://nuxt-pdfmake.behonbaker.com",
                  fit: 90,
                  foreground: "#ffffff",
                  background: "#0f172a",
                  margin: [0, 6, 0, 0],
                },
              ],
              style: "optionCard",
            },
          ],
          columnGap: 12,
        },
      ],
      defaultStyle: {
        color: "#1d293d",
        fontSize: 9,
      },
      styles: {
        title: {
          fontSize: 22,
          bold: true,
          color: "#0f172a",
        },
        subtitle: {
          fontSize: 10,
          color: "#64748b",
          marginTop: 3,
        },
        meta: {
          fontSize: 9,
          color: "#64748b",
        },
        sectionTitle: {
          fontSize: 13,
          bold: true,
          color: "#0f172a",
          marginBottom: 4,
        },
        bodyText: {
          color: "#64748b",
          fontSize: 9,
        },
        qrCard: {
          fillColor: "#f8fafc",
          margin: [12, 14, 12, 14],
          alignment: "center",
        },
        cardLabel: {
          bold: true,
          color: "#0f172a",
          fontSize: 10,
        },
        cardUrl: {
          color: "#0084d1",
          fontSize: 7,
          decoration: "underline",
        },
        optionCard: {
          fillColor: "#f8fafc",
          margin: [12, 10, 12, 12],
          alignment: "center",
        },
        optionLabel: {
          bold: true,
          color: "#0f172a",
          fontSize: 9,
        },
      },
    })
    .getDataUrl();
};

onMounted(() => {
  loadPdf();
});
</script>
