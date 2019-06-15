module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },
}