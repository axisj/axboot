import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    chunkSizeWarningLimit: 1600,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          lodash: ["lodash"],
          antd: ["antd"],
          antdIcons: ["@ant-design/icons"],
          dayjs: ["dayjs"],
          axios: ["axios"],
          reactRouter: ["react-router", "react-router-dom"],
          datagrid: ["@axframe/datagrid"],
          emotion: ["@emotion/react", "@emotion/styled"],
        },
      },
    },
  },
  resolve: {
    alias: [{ find: "@src", replacement: "src" }],
  },
});
