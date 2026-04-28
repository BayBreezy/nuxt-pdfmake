<template>
  <UiContainer class="py-5">
    <div>
      <p class="text-lg font-medium">Open in new window</p>
      <p class="text-muted-foreground mt-1 mb-4">
        Click the button below to open the pdf table in a new window
      </p>
      <UiButton size="sm" variant="outline" text="Print table" @click="exportData" />
      <UiDivider class="my-6" />
    </div>
    <div>
      <p class="text-lg font-medium">Column example</p>
      <p class="text-muted-foreground mt-1 mb-4">
        Here we use the composable to export a column example
      </p>
      <UiButton size="sm" variant="outline" text="Print article" @click="exportComposable" />
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
const { $pdfMake } = useNuxtApp();

const exportComposable = () => {
  const pdfMake = usePDFMake();
  if (!pdfMake) return;

  pdfMake
    .createPdf({
      content: [
        "By default paragraphs are stacked one on top of (or actually - below) another. ",
        "It's possible however to split any paragraph (or even the whole document) into columns.\n\n",
        "Here we go with 2 star-sized columns, with justified text and gap set to 20:\n\n",
        {
          alignment: "justify",
          columns: [
            {
              text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro.",
            },
            {
              text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro.",
            },
          ],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        bigger: { fontSize: 15, italics: true },
      },
      defaultStyle: {
        columnGap: 20,
        font: "Roboto",
        color: "#333",
      },
    })
    .open();
};

const exportData = () => {
  $pdfMake.addTableLayouts({
    custom: {
      fillColor: (rowIndex: number) => (rowIndex % 2 !== 0 ? "#f8fafc" : null),
      hLineColor: "#e5e7eb",
      vLineColor: "#e5e7eb",
      paddingLeft: () => 10,
      paddingRight: () => 10,
    },
  });

  $pdfMake
    .createPdf({
      content: [
        {
          layout: "custom",
          table: {
            heights: 20,
            widths: "*",
            body: [
              ["Id", "Name", "Phone", "Email"],
              ["1", "John Doe", "1234567890", "johndoe@test.com"],
              ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
              ["3", "John Doe", "1234567890", "johndoe@test.com"],
              ["4", "Jane Doe", "1234567890", "janedoe@test.com"],
            ],
          },
        },
      ],
    })
    .open();
};
</script>
