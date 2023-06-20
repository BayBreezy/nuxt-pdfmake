<template>
  <main class="w-full h-[700px]">
    <iframe :src="pdfLink" class="w-full h-full" />
  </main>
</template>

<script setup lang="ts">
import { _colors } from "#tailwind-config/theme";

const pdfLink = ref();

const loadPdf = async () => {
  const { $pdfMake } = useNuxtApp();

  const bigMarging: [number, number, number, number] = [0, 0, 0, 30];
  const smallMarging: [number, number, number, number] = [0, 0, 0, 10];

  $pdfMake
    .createPdf(
      {
        content: [
          {
            text: "Rent Reciept",
            margin: bigMarging,
            style: {
              alignment: "center",
              fontSize: 20,
              bold: true,
            },
          },
          // Date on the left
          {
            text: [
              {
                text: "Date: ",
                bold: true,
              },
              {
                text: "_______________________________",
              },
            ],
            margin: bigMarging,
          },
          // Tenant
          {
            text: [
              {
                text: "Tenant's Name: ",
                bold: true,
              },
              {
                text: "____________________________________",
              },
            ],
            margin: smallMarging,
          },
          //Address
          {
            text: [
              {
                text: "Address of the rented property: ",
                bold: true,
              },
              {
                text: "_____________________________________________",
              },
            ],
            margin: bigMarging,
          },
          // Amoun received
          {
            text: [
              {
                text: "Amount Received: ",
                bold: true,
              },
              {
                text: "____________________________________",
              },
            ],
            margin: smallMarging,
          },
          // Payment method
          {
            text: "Payment Method:",
            style: {
              bold: true,
            },
            margin: smallMarging,
          },
          "[  ]  Cash",
          "[  ]  Check",
          "[  ]  Money Order",
          { text: "[  ]  Other", margin: smallMarging },

          {
            text: [
              {
                text: "Rent required: ",
                bold: true,
              },
              {
                text: "____________________________________",
              },
            ],
            margin: smallMarging,
          },
          {
            text: [
              {
                text: "Rent outstanding:",
                bold: true,
              },
              {
                text: "____________________________________",
              },
            ],
            margin: smallMarging,
          },
          {
            text: [
              {
                text: "Rent covers from ",
                bold: true,
              },
              {
                text: "________________________",
              },
              {
                text: " to ",
                bold: true,
              },
              {
                text: "________________________",
              },
            ],
            margin: [0, 0, 0, 50],
          },
          {
            columns: [
              {
                text: {
                  text: "Landlord's Signature: ",
                  bold: true,
                },
                margin: smallMarging,
              },
              {
                text: {
                  text: "Tenant's Signature: ",
                  bold: true,
                },

                margin: smallMarging,
              },
            ],
          },
          {
            columns: [
              {
                text: {
                  text: "_______________________________",
                },
              },
              {
                text: {
                  text: "_______________________________",
                },
              },
            ],
          },
        ],
        defaultStyle: {
          color: _colors.slate[700],
          font: "playfair",
        },
      },
      {},
      {
        playfair: {
          normal:
            "https://cdn.jsdelivr.net/npm/typeface-playfair-display@1.1.13/files/playfair-display-latin-400.woff",
          bold: "https://cdn.jsdelivr.net/npm/typeface-playfair-display@1.1.13/files/playfair-display-latin-700.woff",
          italics:
            "https://cdn.jsdelivr.net/npm/typeface-playfair-display@1.1.13/files/playfair-display-latin-400italic.woff",
          bolditalics:
            "https://cdn.jsdelivr.net/npm/typeface-playfair-display@1.1.13/files/playfair-display-latin-700italic.woff",
        },
      }
    )
    .getDataUrl((dataUrl: any) => {
      pdfLink.value = dataUrl;
    });
};
onMounted(async () => {
  await loadPdf();
});
</script>
