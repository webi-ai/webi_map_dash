module.exports = {
  mode: 'development',

  entry: {
    app: './index.js'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        // Compile ES2015 using babel
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env', '@babel/react','my-custom-babel-preset'],
              ignore: [ './node_modules/mapbox-gl/dist/mapbox-gl.js' ]
            }
          }
        ]
      }
    ]
  },
}