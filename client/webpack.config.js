const path = require('path')
const { EnvironmentPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: './config/.env.test' })
} else if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: './config/.env.development' })
}

module.exports = (env) => {
  const isProduction = env === 'production'

  return {
    entry: {
      app: './src/app.js',
    },
    output: {
      path: path.join(__dirname, '../public'),
      filename: 'bundle.js',
    },
    mode: process.env.NODE_ENV,
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
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
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
      port: process.env.DEV_SERVER_PORT || 3000,
      historyApiFallback: true,
    },
  }
}
