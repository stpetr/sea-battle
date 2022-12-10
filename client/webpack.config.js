const path = require('path')
const { EnvironmentPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const dotenv = require('dotenv')

const DEFAULT_DEV_SERVER_PORT = 3000

const DEV_ENV = 'dev'
const PROD_ENV = 'prod'

const modes = {
  [DEV_ENV]: 'development',
  [PROD_ENV]: 'production',
  none: 'none',
}

const ENV = process.env.NODE_ENV || DEV_ENV

dotenv.config({ path: `./config/${ENV}.env` })

module.exports = () => {
  const isProduction = ENV === PROD_ENV

  return {
    entry: {
      app: './src/app.js',
    },
    output: {
      path: path.join(__dirname, '../public'),
      filename: 'bundle.js',
    },
    mode: modes[ENV] || modes.none,
    module: {
      rules: [
        {
          loader: 'babel-loader',
          test: /\.js$/,
          exclude: /node_modules/,
        },
        {
          test: /\.(less|css)$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader' },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  strictMath: true,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './src/index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
      new EnvironmentPlugin(['CLIENT_URL', 'SERVER_URL']),
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      static: path.join(__dirname, '../public'),
      port: process.env.DEV_SERVER_PORT || DEFAULT_DEV_SERVER_PORT,
      historyApiFallback: true,
    },
  }
}
