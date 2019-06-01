const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const resolvePath = (partial) => path.resolve(__dirname, partial)

module.exports = {
  entry: {
    entry: resolvePath('src/index.tsx'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: resolvePath('src/index.html'),
    }),
  ],
}
