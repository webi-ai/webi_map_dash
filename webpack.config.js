module.exports = {
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