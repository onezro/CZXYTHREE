// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///E:/XINGYU/XYopcenter/node_modules/.pnpm/vite@5.4.9_@types+node@20.16.11_sass@1.79.5/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/XINGYU/XYopcenter/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vi_7e9df32871ac343ccfd600150d990499/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/XINGYU/XYopcenter/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1._43ca2f65d06c332e5f4c192dca8e648f/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///E:/XINGYU/XYopcenter/vite.config.ts";
var vite_config_default = defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  plugins: [
    vue(),
    vueJsx()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    proxy: {
      "/controlApi": {
        target: "http://172.20.99.47:8055",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/controlApi/, "")
      },
      "/smtApplyApi": {
        target: "http://172.16.28.85:12022",
        //http://172.16.28.106:12022
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApplyApi/, "")
      },
      "/deviceApi": {
        target: "http://172.16.28.85:12022",
        //http://172.20.99.21:5998
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/deviceApi/, "")
      },
      "/ValorMSS": {
        target: "http://172.16.28.116",
        changeOrigin: true
      },
      "/smdProApi": {
        target: "http://172.20.99.21:9980",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smdProApi/, "")
      },
      "/smtApi": {
        target: "http://192.168.1.237:12026",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApi/, "")
      },
      "/dipApi": {
        target: "http://192.168.1.237:12022",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dipApi/, "")
      },
      "/packApi": {
        target: "http://192.168.1.237:12023",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/packApi/, "")
      },
      "/scrApi": {
        target: "http://192.168.1.237:12025",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scrApi/, "")
      },
      "/asyApi": {
        target: "http://192.168.1.237:12021",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/asyApi/, "")
      },
      "/reportApi": {
        target: "http://192.168.1.237:12014",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/reportApi/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxYSU5HWVVcXFxcWFlvcGNlbnRlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcWElOR1lVXFxcXFhZb3BjZW50ZXJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1hJTkdZVS9YWW9wY2VudGVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGNzczoge1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIHZ1ZUpzeCgpLFxyXG5cclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICB9XHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvY29udHJvbEFwaSc6IHsgXHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE3Mi4yMC45OS40Nzo4MDU1JyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2NvbnRyb2xBcGkvLCAnJykgXHJcbiAgICAgIH0sXHJcbiAgICAgICcvc210QXBwbHlBcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE3Mi4xNi4yOC44NToxMjAyMicsLy9odHRwOi8vMTcyLjE2LjI4LjEwNjoxMjAyMlxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvc210QXBwbHlBcGkvLCAnJykgXHJcbiAgICAgIH0sXHJcbiAgICAgICcvZGV2aWNlQXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xNzIuMTYuMjguODU6MTIwMjInLC8vaHR0cDovLzE3Mi4yMC45OS4yMTo1OTk4XHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9kZXZpY2VBcGkvLCAnJykgXHJcbiAgICAgIH0sXHJcbiAgICAgIFwiL1ZhbG9yTVNTXCI6e1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xNzIuMTYuMjguMTE2JyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcclxuICAgICAgfSxcclxuICAgICAgJy9zbWRQcm9BcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE3Mi4yMC45OS4yMTo5OTgwJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3NtZFByb0FwaS8sICcnKSBcclxuICAgICAgfSxcclxuICAgICAgJy9zbXRBcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMS4yMzc6MTIwMjYnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvc210QXBpLywgJycpIFxyXG4gICAgICB9LFxyXG4gICAgICAnL2RpcEFwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjIzNzoxMjAyMicsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9kaXBBcGkvLCAnJykgXHJcbiAgICAgIH0sXHJcbiAgICAgICcvcGFja0FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjIzNzoxMjAyMycsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9wYWNrQXBpLywgJycpIFxyXG4gICAgICB9LFxyXG4gICAgICAnL3NjckFwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjIzNzoxMjAyNScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9zY3JBcGkvLCAnJykgXHJcbiAgICAgIH0sXHJcbiAgICAgICcvYXN5QXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEuMjM3OjEyMDIxJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FzeUFwaS8sICcnKSBcclxuICAgICAgfSxcclxuICAgICAnL3JlcG9ydEFwaSc6IHtcclxuICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMS4yMzc6MTIwMTQnLFxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9yZXBvcnRBcGkvLCAnJykgXHJcbiAgICB9LFxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUCxTQUFTLGVBQWUsV0FBVztBQUV2UixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBSmtJLElBQU0sMkNBQTJDO0FBS3RNLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLEtBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxFQUVUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGlCQUFpQixFQUFFO0FBQUEsTUFDckQ7QUFBQSxNQUNBLGdCQUFnQjtBQUFBLFFBQ2QsUUFBUTtBQUFBO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsa0JBQWtCLEVBQUU7QUFBQSxNQUN0RDtBQUFBLE1BQ0EsY0FBYztBQUFBLFFBQ1osUUFBUTtBQUFBO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsZ0JBQWdCLEVBQUU7QUFBQSxNQUNwRDtBQUFBLE1BQ0EsYUFBWTtBQUFBLFFBQ1YsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsTUFDQSxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsZ0JBQWdCLEVBQUU7QUFBQSxNQUNwRDtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGFBQWEsRUFBRTtBQUFBLE1BQ2pEO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsYUFBYSxFQUFFO0FBQUEsTUFDakQ7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxjQUFjLEVBQUU7QUFBQSxNQUNsRDtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGFBQWEsRUFBRTtBQUFBLE1BQ2pEO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsYUFBYSxFQUFFO0FBQUEsTUFDakQ7QUFBQSxNQUNELGNBQWM7QUFBQSxRQUNiLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxnQkFBZ0IsRUFBRTtBQUFBLE1BQ3BEO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
