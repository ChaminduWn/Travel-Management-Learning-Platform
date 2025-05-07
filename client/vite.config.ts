import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'util': 'rollup-plugin-node-polyfills/polyfills/util',
      'sys': 'util',
      'events': 'rollup-plugin-node-polyfills/polyfills/events',
      'stream': 'rollup-plugin-node-polyfills/polyfills/stream',
      'path': 'rollup-plugin-node-polyfills/polyfills/path',
      'querystring': 'rollup-plugin-node-polyfills/polyfills/qs',
      'punycode': 'rollup-plugin-node-polyfills/polyfills/punycode',
      'url': 'rollup-plugin-node-polyfills/polyfills/url',
      'string_decoder': 'rollup-plugin-node-polyfills/polyfills/string-decoder',
      'http': 'rollup-plugin-node-polyfills/polyfills/http',
      'https': 'rollup-plugin-node-polyfills/polyfills/http',
      'os': 'rollup-plugin-node-polyfills/polyfills/os',
      'assert': 'rollup-plugin-node-polyfills/polyfills/assert',
      'constants': 'rollup-plugin-node-polyfills/polyfills/constants',
      '_stream_duplex': 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
      '_stream_passthrough': 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      '_stream_readable': 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      '_stream_writable': 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      '_stream_transform': 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      'timers': 'rollup-plugin-node-polyfills/polyfills/timers',
      'console': 'rollup-plugin-node-polyfills/polyfills/console',
      'vm': 'rollup-plugin-node-polyfills/polyfills/vm',
      'zlib': 'rollup-plugin-node-polyfills/polyfills/zlib',
      'tty': 'rollup-plugin-node-polyfills/polyfills/tty',
      'domain': 'rollup-plugin-node-polyfills/polyfills/domain'
    },
  },
  define: {
    global: 'window',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['sockjs-client', '@stomp/stompjs'],
  },
  server: {
    proxy: {
      '/ws-chat': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws-chat/, ''),
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/login/oauth2/code': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});