import { Configuration as DevServerConfiguration } from 'webpack-dev-server'

import { BuildOptions } from './types'

export const buildDevServer = (options: BuildOptions): DevServerConfiguration => {
  return {
    port: options.port,
    historyApiFallback: true,
  }
}
1