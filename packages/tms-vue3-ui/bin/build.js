const path = require('path')
const { defineConfig, build } = require('vite')
const vue = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')
const sass = require('sass')
const fs = require('fs')
const { resolve } = require('path')

const format = 'es'
const scriptRegExp = /\.(ts|tsx)$/
const isDir = (dir) => fs.lstatSync(dir).isDirectory()
const isScript = (path) => scriptRegExp.test(path) && path !== 'env.d.ts'
const isScss = (path) => /\.scss/.test(path)
const isCopied = (path) => /\.(js)/.test(path)

// 打包的入口文件
const baseEntryDir = path.resolve(__dirname, '../src')
// 出口文件夹
const baseOutDir = path.resolve(__dirname, `../dist/${format}`)
// vite基础配置
const baseConfig = defineConfig({
  configFile: false,
  publicDir: false,
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': baseEntryDir,
    },
  },
})
// rollup配置
const rollupOptions = {
  // 确保外部化处理那些你不想打包进库的依赖
  external: ['vue'],
}

// 根据文件所在路径，获得输出路径
function getSubDir(dir) {
  let subDir
  if (dir !== baseEntryDir) {
    let name = dir.replace(baseEntryDir + path.sep, '')
    subDir = `${path.sep}${name}`
  } else {
    subDir = ''
  }
  return subDir
}

// 直接复制文件
const directCopy = async (dir, file) => {
  let entry = resolve(dir, file)

  let subDir = getSubDir(dir)
  let outDir = `${baseOutDir}${subDir}`

  if (!fs.existsSync(outDir)) await fs.mkdirSync(outDir, { recursive: true })

  let outFile = `${outDir}/${file}`

  fs.copyFileSync(entry, outFile)
}

// 生成样式文件
const buildStyle = async (dir, file) => {
  let entry = resolve(dir, file)
  let result = await sass.compileAsync(entry)

  let subDir = getSubDir(dir)
  let outDir = `${baseOutDir}${subDir}/style`
  if (!fs.existsSync(outDir)) await fs.mkdirSync(outDir, { recursive: true })

  let outFile
  if (file === 'tailwind.scss') {
    outFile = `${outDir}/${file}`
  } else {
    outFile = `${outDir}/${file.split('.').shift()}.css`
  }

  await fs.writeFileSync(outFile, result.css)
}

// 打包1个组件
const buildComponent = async (dir, file) => {
  let entry = resolve(dir, file)
  let subDir = getSubDir(dir)
  let outDir = `${baseOutDir}${subDir}`

  await build({
    ...baseConfig,
    build: {
      emptyOutDir: false,
      rollupOptions,
      lib: {
        entry,
        name: subDir ? subDir.substring(1) : 'tmsVue3UI',
        fileName: () => `index.js`,
        formats: [format],
      },
      outDir,
    },
  })
}

// 全量打包构建
const travel = async (dir) => {
  const files = fs.readdirSync(dir)
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file)
      // scan dir
      if (isDir(filePath)) {
        return travel(filePath)
      }
      // 直接复制的文件
      if (isCopied(file)) {
        await directCopy(dir, file)
      }
      // compile ts or tsx
      if (isScript(file)) {
        await buildComponent(dir, file)
      }
      // 处理样式文件
      if (isScss(file)) {
        await buildStyle(dir, file)
      }
    })
  )
}

travel(baseEntryDir)
