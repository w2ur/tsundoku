import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tsundoku",
    short_name: "Tsundoku",
    description: "Your personal book collection, beautifully organized",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F5",
    theme_color: "#2D4A3E",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-192.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
