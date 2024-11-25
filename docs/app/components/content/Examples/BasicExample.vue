<template>
  <main class="h-[700px] w-full">
    <iframe v-if="pdfLink" :src="pdfLink" class="h-full w-full" />
  </main>
</template>

<script setup lang="ts">
  import { faker } from "@faker-js/faker";
  import { _colors } from "#tailwind-config/theme";

  const pdfLink = ref();

  const loadPdf = () => {
    const { $pdfMake } = useNuxtApp();

    $pdfMake
      .createPdf(
        {
          content: [
            { text: "Users", style: { fontSize: 20, bold: true }, marginBottom: 5 },
            { text: "This is a sample pdf", marginBottom: 5 },
            { text: `Date: ${new Date().toDateString()}`, marginBottom: 15 },
            {
              layout: "custom",
              color: _colors.slate[800],
              table: {
                widths: ["auto", "*", "auto", "auto"],
                body: [
                  ["ID", "Name", "Phone", "Email"],
                  // Generate 20 rows of fake data
                  ...Array.from({ length: 20 }, (v, k) => [
                    k + 1,
                    faker.person.fullName(),
                    // eslint-disable-next-line
                    faker.helpers.fromRegExp(/[0-9]{3}-[0-9]{3}-[0-9]{4}/),
                    faker.internet.email()?.toLowerCase(),
                  ]),
                ],
              },
            },
          ],
          defaultStyle: {
            color: _colors.slate[800],
          },
        },
        {
          custom: {
            fillColor: function (rowIndex: number) {
              return rowIndex % 2 !== 0 ? _colors.slate[50] : null;
            },
            hLineColor: _colors.slate[200],
            vLineColor: _colors.slate[200],
            paddingBottom: () => 10,
            paddingTop: () => 10,
            paddingLeft: function () {
              return 10;
            },
            paddingRight: function () {
              return 10;
            },
          },
        }
      )
      .getDataUrl((dataUrl: any) => {
        pdfLink.value = dataUrl;
      });
  };
  onMounted(() => {
    loadPdf();
  });
</script>
