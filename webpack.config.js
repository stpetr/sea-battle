const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' })
} else if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env.development' })
}

module.exports = (env, argv) => {
    const isProduction = env === 'production'
    
    return {
        entry: ['babel-polyfill', './client/app.js'],
        output: {
            path: path.join(__dirname, 'public', 'dist'),
            filename: 'bundle.js'
        },
        mode: 'development',
        module: {
            rules: [
                {
                    loader: 'babel-loader',
                    test: /\.js$/, 
                    exclude: /node_modules/
                },
                {
                    test: /\.(less|css)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
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
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'styles.css',
                publicPath: path.join(__dirname, 'public', 'dist'),
            }),
            new webpack.DefinePlugin({
                'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
            })
        ],
        devtool: isProduction ? 'source-map' : 'inline-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            port: process.env.DEV_SERVER_PORT || 3000,
            historyApiFallback: true,
            publicPath: '/dist/'
        }
    }
}
