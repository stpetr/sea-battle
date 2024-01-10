import { ResolveOptions } from 'webpack'

import { BuildOptions } from './types'

export const buildResolvers = (options: BuildOptions): ResolveOptions => {
  return {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    preferAbsolute: true,
    modules: [
      options.paths.src,
      'node_modules',
    ],
  }
}
