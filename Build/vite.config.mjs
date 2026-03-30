import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "fs";
import crypto from "crypto";

// SVG inliner plugin
function inlineSvgFaviconPlugin(options) {
  return {
    name: "inline-svg-favicon",
    enforce: "post",
    transformIndexHtml(html) {
      if (!fs.existsSync(options.svg)) return html;
      let svgContent = fs.readFileSync(options.svg, "utf8");
      // Remove XML header if present, minify spaces
      svgContent = svgContent
        .replace(/<\?xml[^>]*>\s*/g, "")
        .replace(/\s+/g, " ");
      // Base64 encode the SVG
      const base64 = Buffer.from(svgContent).toString("base64");
      const faviconTag = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${base64}"/>\n`;
      // Insert favicon into <head>
      return html.replace(/<head>(.*?)/, `<head>$1\n  ${faviconTag}`);
    },
  };
}

// Inject build info plugin
function injectBuildInfo() {
  return {
    name: "inject-build-info",
    closeBundle() {
      const htmlPath = "./dist/index.html";
      let html = fs.readFileSync(htmlPath, "utf8");
      
      // Compute hash
      const hash = crypto
        .createHash("sha256")
        .update(html)
        .digest("hex");
      
      // Inject hash into build-info script
      html = html.replace(
        '"hash": "BUILD_HASH_WILL_BE_INJECTED"',
        `"hash": "${hash}"`
      );
      
      fs.writeFileSync(htmlPath, html);
    }
  };
}

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");
  const isSingleFile = env.SINGLE_FILE === "true";

  return {
    base: "./",
    plugins: [
      !isSingleFile &&
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['robots.txt'],
          manifest: {
            name: 'Web-Template',
            short_name: 'Web-Template',
            start_url: './',
            display: 'standalone',
            theme_color: '#00bfff',
            background_color: '#00bfff',
          },
          pwaAssets: {
            image: 'public/favicon.png',
            preset: 'minimal-2023',
            includeHtmlHeadLinks: true,
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,png,ico,json}'],
            runtimeCaching: [
              {
                urlPattern: /.*\.(js|css|html)$/,
                handler: 'NetworkFirst',
                options: { cacheName: 'app-shell' },
              },
              {
                urlPattern: /.*\.(png|ico|json)$/,
                handler: 'CacheFirst',
                options: { cacheName: 'assets' },
              },
            ],
          },
        }),
      isSingleFile && viteSingleFile(),
      isSingleFile && inlineSvgFaviconPlugin({ svg: "public/favicon.png" }),
      isSingleFile && injectBuildInfo(),
    ].filter(Boolean),

    build: {
      sourcemap: !isSingleFile,
      outDir: "./dist",
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000,
    },
  };
});
