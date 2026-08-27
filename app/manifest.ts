import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Zema", short_name: "Zema", description: "Music distribution and royalty monetization for Ethiopian & African artists.", start_url: "/", display: "standalone", background_color: "#0b0a08", theme_color: "#0b0a08", icons: [{ src: "/zema-mark.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] };
}
