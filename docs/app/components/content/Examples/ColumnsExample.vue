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
        title: "Quarterly Operations Brief",
        author: "Acme Operations Group",
        subject: "Column-based operations report layout",
        keywords: "columns, operations, report, pdfmake",
        creator: "Nuxt pdfMake",
        producer: "pdfmake",
      },
      pageMargins: [42, 44, 42, 44],
      content: [
        {
          columns: [
            [
              { text: "Quarterly Operations Brief", style: "title" },
              { text: "Q1 2026 performance and planning summary", style: "subtitle" },
            ],
            {
              width: "auto",
              text: "CONFIDENTIAL",
              style: "badge",
            },
          ],
          columnGap: 16,
          marginBottom: 20,
        },
        {
          columns: [
            { text: "Revenue\n$1.42M", style: "metricCard" },
            { text: "Delivery SLA\n98.4%", style: ["metricCard", "positive"] },
            { text: "Open Risks\n4", style: ["metricCard", "warning"] },
          ],
          columnGap: 10,
          marginBottom: 20,
        },
        {
          columns: [
            {
              width: 130,
              stack: [
                { text: "At a Glance", style: "panelTitle" },
                { text: "Region", style: "label" },
                { text: "North America", style: "value" },
                { text: "Report owner", style: "label" },
                { text: "Operations Team", style: "value" },
                { text: "Prepared", style: "label" },
                { text: new Date().toLocaleDateString(), style: "value" },
              ],
              style: "sidePanel",
            },
            {
              width: "*",
              stack: [
                { text: "Executive Readout", style: "sectionTitle" },
                {
                  text: "The quarter closed ahead of plan with stronger enterprise renewals and improved support responsiveness. Capacity remains healthy, but the team should continue monitoring onboarding demand as new customer volume increases.",
                  style: "paragraph",
                },
                {
                  columns: [
                    {
                      width: "*",
                      stack: [
                        { text: "Wins", style: "subheader" },
                        {
                          ul: [
                            "Reduced average ticket age by 22%.",
                            "Expanded managed accounts in two key segments.",
                            "Completed migration of legacy reporting jobs.",
                          ],
                          style: "list",
                        },
                      ],
                    },
                    {
                      width: "*",
                      stack: [
                        { text: "Risks", style: "subheader" },
                        {
                          ul: [
                            "Implementation queue is trending upward.",
                            "Finance review is needed for two vendor renewals.",
                            "Analytics adoption still lags in self-serve accounts.",
                          ],
                          style: "list",
                        },
                      ],
                    },
                  ],
                  columnGap: 16,
                },
              ],
            },
          ],
          columnGap: 18,
          marginBottom: 18,
        },
        { text: "Department Updates", style: "sectionTitle" },
        {
          columns: [
            {
              width: "*",
              stack: [
                { text: "Success", style: "updateTitle" },
                {
                  text: "Renewal meetings are complete for 82% of managed accounts.",
                  style: "paragraph",
                },
              ],
            },
            {
              width: "*",
              stack: [
                { text: "Support", style: "updateTitle" },
                {
                  text: "First response time stayed below the two-hour target.",
                  style: "paragraph",
                },
              ],
            },
            {
              width: "*",
              stack: [
                { text: "Product", style: "updateTitle" },
                {
                  text: "Report templates and scheduled exports are the top adoption drivers.",
                  style: "paragraph",
                },
              ],
            },
          ],
          columnGap: 12,
          marginBottom: 16,
        },
        {
          columns: [
            {
              width: "auto",
              text: "Next checkpoint",
              style: "labelPill",
            },
            {
              width: "*",
              text: "Review implementation staffing, support ticket categories, and template adoption with department leads on April 15.",
              style: "checkpoint",
            },
          ],
          columnGap: 10,
        },
      ],
      defaultStyle: {
        color: "#1d293d",
        fontSize: 10,
        lineHeight: 1.25,
      },
      styles: {
        title: {
          fontSize: 22,
          bold: true,
          color: "#0f172a",
        },
        subtitle: {
          color: "#64748b",
          marginTop: 4,
        },
        badge: {
          bold: true,
          color: "#0369a1",
          fillColor: "#e0f2fe",
          fontSize: 8,
          margin: [8, 6, 8, 6],
        },
        metricCard: {
          bold: true,
          color: "#0f172a",
          fillColor: "#f8fafc",
          margin: [12, 10, 12, 10],
        },
        positive: {
          color: "#16a34a",
        },
        warning: {
          color: "#ca8a04",
        },
        sidePanel: {
          fillColor: "#f8fafc",
          margin: [12, 12, 12, 12],
        },
        panelTitle: {
          bold: true,
          color: "#0f172a",
          marginBottom: 8,
        },
        label: {
          color: "#64748b",
          fontSize: 8,
          marginTop: 7,
        },
        value: {
          bold: true,
          color: "#0f172a",
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          color: "#0f172a",
          marginBottom: 6,
        },
        subheader: {
          bold: true,
          color: "#0f172a",
          marginBottom: 4,
        },
        updateTitle: {
          bold: true,
          color: "#0369a1",
          marginBottom: 4,
        },
        paragraph: {
          color: "#475569",
          marginBottom: 8,
        },
        list: {
          color: "#475569",
        },
        labelPill: {
          bold: true,
          color: "#ffffff",
          fillColor: "#1d293d",
          margin: [10, 8, 10, 8],
        },
        checkpoint: {
          color: "#0f172a",
          fillColor: "#f8fafc",
          margin: [10, 8, 10, 8],
        },
      },
    })
    .getDataUrl();
};

onMounted(() => {
  loadPdf();
});
</script>
