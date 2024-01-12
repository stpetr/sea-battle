import path from 'path'
import dotenv from 'dotenv'

import { buildWebpackConfig } from './config/build/build-webpack-config'

import { BuildEnv, BuildMode, BuildPaths } from './config/build/types'

dotenv.config({ path: './config/.env' })

export default (env: BuildEnv) => {
  const paths: BuildPaths = {
    entry: path.resolve(__dirname, 'src/app.tsx'),
    build: path.resolve(__dirname, '../public'),
    html: path.resolve(__dirname, 'src/index.html'),
    favicon: path.resolve(__dirname, 'src/assets/images/favicon.ico'),
    src: path.resolve(__dirname, 'src'),
  }
  const mode: BuildMode = env.MODE ?? 'development'
  const port = env.PORT ?? 3010
  const isDevMode = mode === 'development'

  return buildWebpackConfig({
    mode,
    paths,
    isDevMode,
    port,
  })
}
