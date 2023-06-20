<template>
  <div>
    <UContainer>
      <UButton
        label="Export"
        @click="exportData"
      />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { $pdfMake } = useNuxtApp();
import { _colors } from "#tailwind-config/theme";

const exportData = () => {
  $pdfMake.tableLayouts = {
    custom: {
      fillColor: function (rowIndex) {
        return rowIndex % 2 !== 0 ? _colors.slate[50] : null;
      },
      hLineColor: _colors.slate[200],
      vLineColor: _colors.slate[200],
      paddingLeft: function () {
        return 10;
      },
      paddingRight: function () {
        return 10;
      },
    },
  };

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
              ["1", "John Doe", "1234567890", "johndoe@test.com"],
              ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
              ["1", "John Doe", "1234567890", "johndoe@test.com"],
              ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
              ["1", "John Doe", "1234567890", "johndoe@test.com"],
              ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
              ["1", "John Doe", "1234567890", "johndoe@test.com"],
              ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
              ["1", "John Doe", "1234567890", "johndoe@test.com"],
              ["2", "Jane Doe", "1234567890", "janedoe@test.com"],
            ],
          },
        },
      ],
    })
    .open();
};
</script>
