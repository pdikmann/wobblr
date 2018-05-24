const https = require('https')
const cities = require('./cities.js') // city db

function getDaily( callback ){
  https.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', (res) => {
    let body = '';
    res.on( 'data', chunk => body += chunk )
    res.on( 'end', () => {
      body = JSON.parse( body )
      callback( body )
    })
  }).end()
}

const data = {
  offline: false, // offline mode for demo purposes
  cities: [],
  daily: {},
  monthly: {},
  init: () => {
    data.cities = cities.loadCities()
    console.log( "init" )
  },
  update: callback => {
    if ( data.offline ){
      data.daily = JSON.parse( fs.readFileSync( 'static/all_day.geojson', {encoding: 'utf8'} ))
      console.log( "using offline data" )
      callback()
    } else {
      getDaily( daily =>{ data.daily = daily; callback()})
    }
  }
}
data.init()

module.exports = data
