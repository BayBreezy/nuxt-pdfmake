<template>
  <main class="w-full">
    <TabGroup>
      <TabList class="border-b mb-3 dark:border-zinc-700">
        <Tab
          class="px-4 py-2 text-sm font-medium bg-transparent data-[headlessui-state=selected]:bg-primary-500 dark:data-[headlessui-state=selected]:bg-primary-500"
          >PDF</Tab
        >
        <Tab>Code</Tab>
      </TabList>
      <TabPanels>
        <TabPanel as="div" class="h-screen">
          <iframe :src="pdfLink" class="w-full h-full" />
        </TabPanel>
        <TabPanel class="max-h-[700px] overflow-auto">
          <ContentSlot :use="$slots.default" />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </main>
</template>

<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import { _colors } from "#tailwind-config/theme";

let pdfLink = ref();

const loadPdf = () => {
  const { $pdfMake } = useNuxtApp();
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
    .getDataUrl((dataUrl: any) => {
      pdfLink.value = dataUrl;
    });
};
onMounted(() => {
  loadPdf();
});
</script>
