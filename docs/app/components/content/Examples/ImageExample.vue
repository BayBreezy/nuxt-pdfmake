<template>
  <main class="h-175 w-full">
    <UiIframeLazy v-if="pdfLink" :src="pdfLink" class="h-full w-full" />
  </main>
</template>

<script setup lang="ts">
const pdfLink = ref<string | null>(null);

const toBase64 = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = reject;
    img.src = url;
  });

const loadPdf = async () => {
  const pdfMake = usePDFMake();
  if (!pdfMake) return;

  const heroImage = await toBase64(
    "https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1",
  );

  pdfLink.value = await pdfMake
    .createPdf({
      info: {
        title: "Property Showcase",
        author: "Acme Realty Group",
        subject: "Featured property listing with images",
        creator: "Nuxt pdfMake",
        producer: "pdfmake",
      },
      pageMargins: [40, 46, 40, 42],
      content: [
        {
          columns: [
            [
              { text: "Property Showcase", style: "title" },
              { text: "Acme Realty Group — Featured Listing", style: "subtitle" },
            ],
            {
              text: `Listed ${new Date().toLocaleDateString()}`,
              style: "meta",
              alignment: "right",
            },
          ],
          marginBottom: 16,
        },
        {
          image: heroImage,
          width: 515,
          margin: [0, 0, 0, 16],
        },
        { text: "Sunset Ridge Estate", style: "propertyTitle" },
        {
          columns: [
            { text: "4 bed  ·  3 bath  ·  2,840 sq ft", style: "specs" },
            { text: "$1,250,000", style: "price", alignment: "right" },
          ],
          marginBottom: 12,
        },
        {
          text: "A spacious modern home nestled in a quiet cul-de-sac with panoramic views, an open-plan kitchen, and a resort-style backyard. Natural light fills every room throughout the day.",
          style: "description",
          marginBottom: 16,
        },
        {
          columns: [
            {
              width: "*",
              stack: [
                { text: "Interior", style: "featureHeader" },
                {
                  ul: [
                    "Chef's kitchen with island",
                    "Primary suite with walk-in closet",
                    "Hardwood floors throughout",
                  ],
                  style: "featureList",
                },
              ],
            },
            {
              width: "*",
              stack: [
                { text: "Exterior", style: "featureHeader" },
                {
                  ul: ["Heated pool and spa", "Three-car garage", "Low-maintenance landscaping"],
                  style: "featureList",
                },
              ],
            },
          ],
          columnGap: 14,
          marginBottom: 16,
        },
        { text: "Gallery", style: "sectionTitle" },
        {
          text: "External URLs can be passed directly via the images dictionary — pdfMake fetches them at render time.",
          style: "caption",
          marginBottom: 8,
        },
        {
          columns: [
            { image: "mountain", width: 162 },
            { image: "forest", width: 162 },
            { image: "ocean", width: 162 },
          ],
          columnGap: 10,
        },
      ],
      images: {
        mountain:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60&auto=format&fit=crop",
        forest:
          "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=60&auto=format&fit=crop",
        ocean:
          "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=60&auto=format&fit=crop",
      },
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
        propertyTitle: {
          fontSize: 16,
          bold: true,
          color: "#0f172a",
          marginBottom: 4,
        },
        specs: {
          color: "#64748b",
          fontSize: 9,
        },
        price: {
          fontSize: 14,
          bold: true,
          color: "#16a34a",
        },
        description: {
          color: "#475569",
          lineHeight: 1.4,
        },
        featureHeader: {
          bold: true,
          color: "#0f172a",
          fontSize: 10,
          marginBottom: 4,
        },
        featureList: {
          color: "#475569",
        },
        sectionTitle: {
          fontSize: 12,
          bold: true,
          color: "#0f172a",
          marginBottom: 4,
        },
        caption: {
          color: "#64748b",
          fontSize: 8,
          italics: true,
        },
      },
    })
    .getDataUrl();
};

onMounted(() => {
  loadPdf();
});
</script>
