<template>
  <UiContainer class="py-5">
    <div class="mb-4">
      <p class="text-lg font-medium">Live PDF Editor</p>
      <p class="text-muted-foreground text-sm">
        Edit the document definition on the left and see the PDF update in real time.
      </p>
    </div>

    <div class="flex gap-4" style="height: calc(100vh - 160px)">
      <!-- Editor pane -->
      <div class="flex w-1/2 flex-col gap-2">
        <div class="flex items-center justify-between">
          <label class="text-muted-foreground text-xs font-medium tracking-wide uppercase"
            >Document Definition (JSON)</label
          >
          <div class="flex gap-2">
            <UiButton size="xs" variant="outline" text="Open" @click="openInTab" />
            <UiButton size="xs" variant="outline" text="Download" @click="download" />
          </div>
        </div>
        <textarea
          v-model="docJson"
          class="bg-background focus:ring-ring flex-1 resize-none rounded-md border p-3 font-mono text-xs focus:ring-1 focus:outline-none"
          spellcheck="false"
        />
        <p v-if="error" class="text-destructive text-xs">{{ error }}</p>
      </div>

      <!-- Preview pane -->
      <div class="flex w-1/2 flex-col gap-2">
        <label class="text-muted-foreground text-xs font-medium tracking-wide uppercase"
          >Preview</label
        >
        <div class="flex-1 overflow-hidden rounded-md border bg-white" style="min-height: 0">
          <iframe v-if="pdfDataUrl" :src="pdfDataUrl" class="h-full w-full" title="PDF Preview" />
          <div v-else class="text-muted-foreground flex h-full items-center justify-center text-sm">
            {{ error ? "Fix the JSON to see a preview" : "Generating preview…" }}
          </div>
        </div>
      </div>
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
const pdfMake = usePDFMake();
const pdfDataUrl = ref<string | null>(null);
const error = ref<string | null>(null);

const DEFAULT_DOC = {
  content: [
    { text: "Hello from nuxt-pdfmake!", fontSize: 22, bold: true, margin: [0, 0, 0, 12] },
    {
      text: "Edit this document definition on the left and watch the PDF update in real time.",
      color: "#64748b",
    },
    { text: "\nFeatures you can try:", margin: [0, 16, 0, 4], bold: true },
    {
      ul: [
        "Tables with custom layouts",
        "Columns and nested elements",
        "Custom fonts (configured via module options)",
        "Images (base64 or URL)",
        "Headers and footers",
      ],
    },
  ],
  defaultStyle: { font: "Lato", fontSize: 12, lineHeight: 1.4 },
};

const docJson = ref(JSON.stringify(DEFAULT_DOC, null, 2));

const regenerate = useDebounceFn(async () => {
  if (!pdfMake) return;
  try {
    const docDef = JSON.parse(docJson.value);
    const doc = pdfMake.createPdf(docDef);
    pdfDataUrl.value = await doc.getDataUrl();
    error.value = null;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}, 400);

watch(docJson, regenerate, { immediate: true });

const openInTab = async () => {
  if (!pdfMake || error.value) return;
  const tab = window.open("", "_blank");
  try {
    const dataUrl = await pdfMake.createPdf(JSON.parse(docJson.value)).getDataUrl();
    if (!tab) {
      window.location.href = dataUrl;
      return;
    }
    tab.document.title = "document.pdf";
    tab.document.body.style.margin = "0";
    const frame = tab.document.createElement("iframe");
    frame.src = dataUrl;
    frame.style.border = "0";
    frame.style.height = "100vh";
    frame.style.width = "100vw";
    tab.document.body.append(frame);
  } catch (e: unknown) {
    tab?.close();
    error.value = e instanceof Error ? e.message : String(e);
  }
};

const download = async () => {
  if (!pdfMake || error.value) return;
  try {
    const dataUrl = await pdfMake.createPdf(JSON.parse(docJson.value)).getDataUrl();
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "document.pdf";
    link.click();
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  }
};
</script>
