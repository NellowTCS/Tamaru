module.exports = {
  siteTitle: "Tamaru",
  siteUrl: "https://nellowtcs.github.io/Tamaru/docs",

  logo: {
    alt: "Tamaru",
    href: "./",
  },
  favicon: "",

  srcDir: "docs",
  outputDir: "site",

  theme: {
    name: "sky",
    defaultMode: "system",
    enableModeToggle: true,
    positionMode: "top",
    codeHighlight: true,
    customCss: [],
  },

  search: true,
  minify: true,
  autoTitleFromH1: true,
  copyCode: true,
  pageNavigation: true,

  navigation: [
    { title: "Home", path: "/", icon: "home" },
    { title: "Configuration", path: "/config", icon: "settings" },
    { title: "API Reference", path: "/api", icon: "file-code" },
    {
      title: "GitHub",
      path: "https://github.com/NellowTCS/Tamaru",
      icon: "github",
      external: true,
    },
  ],

  plugins: {
    seo: {
      defaultDescription: "A modular, responsive virtual trackball widget for the web.",
      openGraph: {
        defaultImage: "",
      },
      twitter: {
        cardType: "summary_large_image",
      },
    },
    sitemap: {
      defaultChangefreq: "weekly",
      defaultPriority: 0.8,
    },
  },

  footer: "Built with [docmd](https://docmd.io). [View on GitHub](https://github.com/NellowTCS/Tamaru).",

  editLink: {
    enabled: true,
    baseUrl: "https://github.com/NellowTCS/Tamaru/edit/main/Docs/docs",
    text: "Edit the Docs",
  },
};
