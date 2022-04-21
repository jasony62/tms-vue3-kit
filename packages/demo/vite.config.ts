import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'

console.log('111', require.resolve('tms-vue3-ui'))

export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'tms-vue3-ui',
          // esModule: true,
          resolveStyle: (name) => {
            return `tms-vue3-ui/dist/es/${name}/style/index.css`
          },
        },
      ],
    }),
  ],
})
