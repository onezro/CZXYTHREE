import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/controlApi': { 
        target: 'http://172.20.99.47:8055',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/controlApi/, '') 
      },
      '/smtApplyApi': {
        target: 'http://172.16.28.85:12022',//http://172.16.28.106:12022
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApplyApi/, '') 
      },
      '/deviceApi': {
        target: 'http://172.16.28.85:12022',//http://172.20.99.21:5998
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/deviceApi/, '') 
      },
      '/smtApi': {
        target: 'http://192.168.1.237:12026',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApi/, '') 
      },
      '/dipApi': {
        target: 'http://192.168.1.237:12022',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dipApi/, '') 
      },
      '/packApi': {
        target: 'http://192.168.1.237:12023',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/packApi/, '') 
      },
      '/scrApi': {
        target: 'http://192.168.1.237:12025',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scrApi/, '') 
      },
      '/asyApi': {
        target: 'http://192.168.1.237:12021',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/asyApi/, '') 
      },
     '/reportApi': {
      target: 'http://192.168.1.237:12014',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/reportApi/, '') 
    },
    }
  }
})
