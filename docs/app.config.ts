export default defineAppConfig({
  docus: {
    title: "Nuxt PDFMake",
    description: "Nuxt PDFMake is a Nuxt module to generate PDFs with PDFMake",
    image: "/cover.png",
    socials: {
      twitter: "iAm_BayBreezy",
      github: "BayBreezy",
      youtube: "channel/UC2TD0i0-m8Jy0nAbpoYYCDQ",
    },
    github: {
      dir: "docs/content",
      branch: "main",
      repo: "nuxt-pdfmake",
      owner: "BayBreezy",
      edit: true,
    },
    header: {
      logo: true,
    },
    footer: {
      iconLinks: [
        {
          href: "https://behonbaker.com",
          icon: "heroicons:globe-alt",
        },
      ],
    },
  },
});
