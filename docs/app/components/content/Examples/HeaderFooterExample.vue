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

  const sections = [
    {
      title: "Executive Summary",
      body: "This annual report provides a comprehensive overview of Acme Corporation's financial performance, strategic initiatives, and operational highlights for the fiscal year ending December 31, 2025. Revenue grew 23% year-over-year driven by enterprise expansion and new product launches across all three business units. We exceeded every financial target set at the start of the year.",
    },
    {
      title: "Financial Highlights",
      body: "Total revenue reached $48.6M, exceeding our guidance of $44–46M. Gross margin improved to 74%, up from 69% in the prior year. Operating income was $11.2M representing a 23% operating margin. We ended the year with $18.4M in cash and no long-term debt, providing a strong foundation for continued investment in growth and international expansion.",
    },
    {
      title: "Product & Engineering",
      body: "We shipped four major platform releases in 2025, doubling the frequency of the prior year. Key launches included the new Analytics Suite, Workflow Automation engine, and an expanded public API. Engineering headcount grew from 42 to 68 engineers. Customer-reported defect rates fell by 41% following adoption of the new quality gate process introduced in Q2.",
    },
    {
      title: "Sales & Marketing",
      body: "Net new annual recurring revenue of $14.2M was added in 2025, a 31% increase over 2024. The enterprise segment (contracts > $50k ARR) now represents 62% of total ARR, up from 47%. Customer acquisition cost improved by 18% due to higher inbound conversion rates from content and community investments. Annual churn remained flat at 3.2%.",
    },
    {
      title: "Outlook for 2026",
      body: "We are guiding for total revenue of $60–64M in 2026, reflecting 24–32% growth. We plan to invest an additional $6M in product and engineering and expand go-to-market presence into two new international markets. A Series C fundraise is expected to close in Q2 2026 to support these growth initiatives and extend our cash runway.",
    },
  ];

  pdfLink.value = await pdfMake
    .createPdf({
      info: {
        title: "Annual Report 2025",
        author: "Acme Corporation",
        subject: "Fiscal year 2025 annual report",
        creator: "Nuxt pdfMake",
        producer: "pdfmake",
      },
      pageMargins: [40, 68, 40, 56],

      header: (currentPage: number, pageCount: number) => ({
        columns: [
          { text: "Acme Corporation  —  Annual Report 2025", style: "headerLeft" },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            style: "headerRight",
            alignment: "right",
          },
        ],
        margin: [40, 22, 40, 0],
      }),

      footer: () => ({
        columns: [
          { text: "Confidential. For internal use only.", style: "footerLeft" },
          {
            text: "© 2025 Acme Corporation. All rights reserved.",
            style: "footerRight",
            alignment: "right",
          },
        ],
        margin: [40, 0, 40, 20],
      }),

      content: [
        { text: "ANNUAL REPORT", style: "reportLabel" },
        { text: "Acme Corporation", style: "reportTitle" },
        { text: "Fiscal Year 2025", style: "reportSubtitle" },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1,
              lineColor: "#e2e8f0",
            },
          ],
          margin: [0, 16, 0, 20],
        },
        {
          columns: [
            { text: "Revenue\n$48.6M", style: "kpi" },
            { text: "Gross Margin\n74%", style: ["kpi", "positive"] },
            { text: "New ARR\n$14.2M", style: "kpi" },
            { text: "Headcount\n+62%", style: ["kpi", "positive"] },
          ],
          columnGap: 10,
          marginBottom: 8,
        },
        ...sections.flatMap((section, i) => [
          {
            text: section.title,
            style: "sectionTitle",
            pageBreak: i > 0 ? ("before" as const) : undefined,
          },
          { text: section.body, style: "body" },
        ]),
      ],

      defaultStyle: {
        color: "#1d293d",
        fontSize: 10,
        lineHeight: 1.4,
      },
      styles: {
        headerLeft: {
          fontSize: 8,
          color: "#64748b",
        },
        headerRight: {
          fontSize: 8,
          color: "#64748b",
        },
        footerLeft: {
          fontSize: 7,
          color: "#94a3b8",
        },
        footerRight: {
          fontSize: 7,
          color: "#94a3b8",
        },
        reportLabel: {
          fontSize: 9,
          color: "#94a3b8",
          bold: true,
          characterSpacing: 2,
          marginBottom: 6,
        },
        reportTitle: {
          fontSize: 32,
          bold: true,
          color: "#0f172a",
          marginBottom: 4,
        },
        reportSubtitle: {
          fontSize: 14,
          color: "#64748b",
        },
        kpi: {
          bold: true,
          color: "#0f172a",
          fillColor: "#f8fafc",
          margin: [12, 10, 12, 10],
          fontSize: 10,
        },
        positive: {
          color: "#16a34a",
        },
        sectionTitle: {
          fontSize: 18,
          bold: true,
          color: "#0f172a",
          marginBottom: 8,
          marginTop: 4,
        },
        body: {
          color: "#475569",
          marginBottom: 12,
        },
      },
    })
    .getDataUrl();
};

onMounted(() => {
  loadPdf();
});
</script>
