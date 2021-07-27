module.exports = {
  mode: 'development',

  entry: {
    app: './map.js'
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
              presets: ['@babel/env', '@babel/react']
            }
          }
        ]
      }
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
        resolve:{
            alias: {
                ...config.resolve.alias,
                'mapbox-gl': 'maplibre-gl'
            }
        }
    })
  // Important: return the modified config
  return config
},
}