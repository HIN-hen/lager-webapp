// https://de.vitejs.dev/guide/static-deploy.html
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import terser from '@rollup/plugin-terser';
import pugPlugin from 'vite-plugin-pug';

export default defineConfig({ 
  // Enable server-side code watching and HMR
  server: {
    watch: {
        usePolling: true,
    },
  },
  plugins: [
    // Node.js-Module unterstützen
    VitePluginNode({
      adapter: 'express', // Adapter
      appPath: './src/app.js', // Pfad zur Node.js-Datei
      exportName: 'viteNodeApp', // exportierte Funktion aus der App-Datei
    }),
    pugPlugin({
      pugOptions: { basedir: './src/views' }
    }) 
  ],
  // build
  build: {
    minify: 'esbuild', // Default minifier (fast)
    cssMinify: true,   // CSS minification
    rollupOptions: {
      plugins: [
        terser({
          compress: {
            drop_console: true, // Remove console logs
            drop_debugger: true, // Remove debugger statements
            passes: 2,          // Multiple passes for better compression
          },
          format: {
            comments: false,    // Remove comments
          },
        }),
      ],
    },
  }
});
