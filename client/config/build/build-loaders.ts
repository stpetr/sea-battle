import { RuleSetRule } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { BuildOptions } from './types'

export const buildLoaders = (options: BuildOptions): RuleSetRule[] => {
  const stylesClassNames = options.isDevMode ? '[name]__[local]--[hash:base64:5]' : '[hash:base64:8]'

  const tsLoader = {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  }

  const jsLoader = {
    loader: 'babel-loader',
    test: /\.jsx?$/,
    exclude: /node_modules/,
  }

  const lessLoader = {
    test: /\.less$/i,
    use: [
      options.isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            auto: /\.module\.less$/i,
            localIdentName: stylesClassNames,
          },
        }
      },
      'less-loader',
    ],
  }

  const sassLoader = {
    test: /\.scss$/i,
    use: [
      options.isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            auto: /\.module\.scss$/i,
            localIdentName: stylesClassNames,
          },
        }
      },
      'sass-loader',
    ],
  }

  const fileLoader = {
    test: /\.(png|jpe?g|svg|gif)$/i,
    use: ['file-loader'],
  }

  return [
    tsLoader,
    jsLoader,
    lessLoader,
    sassLoader,
    fileLoader,
  ]
}
