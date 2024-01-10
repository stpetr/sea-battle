import path from 'path'
import dotenv from 'dotenv'

import { buildWebpackConfig } from './config/build/build-webpack-config'

import { BuildEnv, BuildMode, BuildPaths } from './config/build/types'

export default (env: BuildEnv) => {
  const paths: BuildPaths = {
    entry: path.resolve(__dirname, 'src/app.tsx'),
    build: path.resolve(__dirname, 'dist'),
    html: path.resolve(__dirname, 'src/index.html'),
    favicon: path.resolve(__dirname, 'src/assets/images/favicon.ico'),
    src: path.resolve(__dirname, 'src'),
  }
  const mode: BuildMode = env.mode ?? 'development'
  const port = env.port ?? 3010
  const isDevMode = mode === 'development'

  dotenv.config({ path: './config/.env' })

  return buildWebpackConfig({
    mode,
    paths,
    isDevMode,
    port,
  })
}
