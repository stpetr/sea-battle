import webpack from 'webpack'

import { buildLoaders } from './build-loaders'
import { buildResolvers } from './build-resolvers'
import { buildPlugins } from './build-plugins'
import { buildDevServer } from './build-dev-server'

import { BuildOptions } from './types'

export const buildWebpackConfig = (options: BuildOptions): webpack.Configuration => {
  const {mode, paths, isDevMode} = options

  return {
    mode,
    entry: paths.entry,
    output: {
      publicPath: '/',
      path: paths.build,
      filename: '[name].[contenthash].js',
      clean: true,
    },
    plugins: buildPlugins(options),
    module: {
      rules: buildLoaders(options),
    },
    resolve: buildResolvers(options),
    devtool: isDevMode ? 'inline-source-map' : undefined,
    devServer: isDevMode ? buildDevServer(options) : undefined,
  }
}
