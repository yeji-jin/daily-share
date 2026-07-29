import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/",
        "/settings",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/post",
        "/profile",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
