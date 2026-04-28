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
        title: "Typography Reference",
        author: "Acme Design",
        subject: "pdfMake text formatting and typography options",
        keywords: "typography, decoration, spacing, alignment, pdfmake",
        creator: "Nuxt pdfMake",
        producer: "pdfmake",
      },
      pageMargins: [40, 46, 40, 42],
      content: [
        {
          columns: [
            [
              { text: "Typography Reference", style: "title" },
              {
                text: "Text decoration, sizing, spacing, alignment, and inline styles",
                style: "subtitle",
              },
            ],
            {
              text: `Generated ${new Date().toLocaleDateString()}`,
              style: "meta",
              alignment: "right",
            },
          ],
          marginBottom: 22,
        },

        { text: "1. Font Weight & Style", style: "sectionTitle" },
        {
          text: [
            { text: "Regular   ", fontSize: 11 },
            { text: "Bold   ", fontSize: 11, bold: true },
            { text: "Italics   ", fontSize: 11, italics: true },
            { text: "Bold Italics", fontSize: 11, bold: true, italics: true },
          ],
          marginBottom: 14,
        },

        { text: "2. Text Decoration", style: "sectionTitle" },
        {
          text: [
            { text: "Underline   ", decoration: "underline" },
            { text: "Strike-through   ", decoration: "lineThrough" },
            { text: "Double underline   ", decoration: "underline", decorationStyle: "double" },
            { text: "Dotted   ", decoration: "underline", decorationStyle: "dotted" },
            { text: "Dashed   ", decoration: "underline", decorationStyle: "dashed" },
            {
              text: "Wavy",
              decoration: "underline",
              decorationStyle: "wavy",
              decorationColor: "#0369a1",
            },
          ],
          marginBottom: 14,
        },

        { text: "3. Font Sizes", style: "sectionTitle" },
        {
          text: [
            { text: "8pt  ", fontSize: 8 },
            { text: "10pt  ", fontSize: 10 },
            { text: "12pt  ", fontSize: 12 },
            { text: "14pt  ", fontSize: 14 },
            { text: "18pt  ", fontSize: 18 },
            { text: "24pt  ", fontSize: 24 },
            { text: "32pt", fontSize: 32, bold: true },
          ],
          marginBottom: 14,
        },

        { text: "4. Color & Background Fill", style: "sectionTitle" },
        {
          text: [
            { text: "Slate   ", color: "#475569" },
            { text: "Blue   ", color: "#0369a1" },
            { text: "Green   ", color: "#16a34a" },
            { text: "Red   ", color: "#dc2626" },
            { text: "Amber   ", color: "#d97706" },
            { text: "Purple   ", color: "#7c3aed" },
            { text: "  Highlight  ", background: "#fef9c3" },
            { text: "  Badge  ", color: "#0369a1", background: "#e0f2fe" },
          ],
          marginBottom: 14,
        },

        { text: "5. Character Spacing", style: "sectionTitle" },
        {
          stack: [
            { text: "Normal spacing (0)", characterSpacing: 0, marginBottom: 4 },
            { text: "Tight spacing (−1)", characterSpacing: -1, marginBottom: 4 },
            { text: "Wide spacing (2)", characterSpacing: 2, marginBottom: 4 },
            { text: "Very wide spacing (5)", characterSpacing: 5 },
          ],
          marginBottom: 14,
        },

        { text: "6. Superscript & Subscript", style: "sectionTitle" },
        {
          text: [
            "Water is H",
            { text: "2", sub: true },
            "O.  Einstein's equation: E = mc",
            { text: "2", sup: true },
            ".  Footnote reference",
            { text: "1", sup: true, color: "#0369a1" },
            ".",
          ],
          marginBottom: 14,
        },

        { text: "7. Line Height", style: "sectionTitle" },
        {
          columns: [
            {
              width: "*",
              stack: [
                { text: "Tight (0.9)", style: "colLabel" },
                {
                  text: "Leading controls vertical space between lines. Tighter values make text feel denser and more compact.",
                  lineHeight: 0.9,
                  style: "sample",
                },
              ],
            },
            {
              width: "*",
              stack: [
                { text: "Normal (1.3)", style: "colLabel" },
                {
                  text: "Leading controls vertical space between lines. Tighter values make text feel denser and more compact.",
                  lineHeight: 1.3,
                  style: "sample",
                },
              ],
            },
            {
              width: "*",
              stack: [
                { text: "Loose (1.8)", style: "colLabel" },
                {
                  text: "Leading controls vertical space between lines. Tighter values make text feel denser and more compact.",
                  lineHeight: 1.8,
                  style: "sample",
                },
              ],
            },
          ],
          columnGap: 14,
          marginBottom: 14,
        },

        { text: "8. Text Alignment", style: "sectionTitle" },
        {
          columns: [
            {
              text: "Left aligned — text sits flush against the left edge.",
              alignment: "left",
              style: "alignSample",
            },
            {
              text: "Center aligned — text is centered in the column.",
              alignment: "center",
              style: "alignSample",
            },
            {
              text: "Right aligned — text sits flush against the right edge.",
              alignment: "right",
              style: "alignSample",
            },
            {
              text: "Justified — text stretches to fill the full column width on each line.",
              alignment: "justify",
              style: "alignSample",
            },
          ],
          columnGap: 10,
          marginBottom: 14,
        },

        { text: "9. Font Families", style: "sectionTitle" },
        {
          text: "These Google Fonts are embedded at build time via the googleFonts option in nuxt.config. Each row shows normal, bold, and italic variants.",
          style: "bodyText",
          marginBottom: 10,
        },
        ...[
          { family: "Inter", label: "Inter — Modern geometric sans-serif" },
          { family: "Merriweather", label: "Merriweather — Classic editorial serif" },
          { family: "Montserrat", label: "Montserrat — Display geometric sans-serif" },
          { family: "Nunito", label: "Nunito — Rounded friendly sans-serif" },
          { family: "Playfair Display", label: "Playfair Display — High-contrast elegant serif" },
        ].map((f) => ({
          table: {
            widths: [130, "*", "*", "*"],
            body: [
              [
                { text: f.label, style: "fontLabel" },
                { text: "The quick brown fox jumps over the lazy dog.", font: f.family },
                { text: "The quick brown fox.", font: f.family, bold: true },
                { text: "The quick brown fox.", font: f.family, italics: true },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0,
            hLineColor: () => "#e2e8f0",
            paddingTop: () => 7,
            paddingBottom: () => 7,
            paddingLeft: () => 6,
            paddingRight: () => 6,
          },
          marginBottom: 2,
        })),
      ],
      defaultStyle: {
        color: "#1d293d",
        fontSize: 10,
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
          fontSize: 12,
          bold: true,
          color: "#0f172a",
          marginBottom: 6,
        },
        colLabel: {
          fontSize: 8,
          color: "#64748b",
          bold: true,
          marginBottom: 4,
        },
        sample: {
          color: "#475569",
          fontSize: 9,
        },
        alignSample: {
          color: "#475569",
          fontSize: 9,
          fillColor: "#f8fafc",
          margin: [8, 8, 8, 8],
        },
        bodyText: {
          color: "#64748b",
          fontSize: 9,
        },
        fontLabel: {
          fontSize: 8,
          bold: true,
          color: "#64748b",
        },
      },
    })
    .getDataUrl();
};

onMounted(() => {
  loadPdf();
});
</script>
