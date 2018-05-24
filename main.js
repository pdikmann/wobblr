const hostname = '127.0.0.1'
const port = 3000
//
const fs = require('fs')
const http = require('http')
const express = require('express')
const app = express()

// https://stackoverflow.com/questions/24680247/check-if-a-latitude-and-longitude-is-within-a-circle-google-maps
function arePointsNear(checkPoint, centerPoint, km) {
  var ky = 40000 / 360;
  var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky
  var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx
  var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky
  return Math.sqrt(dx * dx + dy * dy) <= km
}

const cityfile = fs.readFileSync( '/home/philipp/Downloads/simplemaps-worldcities-basic-oc.csv', {encoding: 'utf8' })
const citylines = cityfile.split('\n')

function remove( thing, from ){
  return from.reduce((acc,curr) => curr !== thing ? acc.concat(curr) : acc, [])
}

function cleanLine( line ){
  return remove( '', remove( ',', line.split('"')))
}

const daily = {
  data: {},
  update: () => {
    const contents = fs.readFileSync( 'all_day.geojson', {encoding: 'utf8'} )
    daily.data = JSON.parse( contents )
    //const view = data.features.map( f => [f.properties.place, f.properties.mag, '<br>' ])
    //const places = data.features.map( f => f.properties.place.replace( /.*? of /, '' ))
  }
}

function inRange( centerPoint, range ){
  let r = []
  for ( const feature of daily.data.features ){
    const checkPoint = { lng: feature.geometry.coordinates[0],
                         lat: feature.geometry.coordinates[1] }
    if ( arePointsNear( checkPoint, centerPoint, range )){
      r.push( feature )
    }
  }
  return r
}

app.get('/', (req, res) => {res.send( 'Hello World' )})

app.get('/recent', (req, res) => {
  daily.update()
  //res.send( daily.data )
  res.send( inRange({ lng: req.query.lng,
                      lat: req.query.lat },
                   req.query.range))
})

app.get('/huh', (req, res) => res.send( req.query ))

app.listen( port, () => console.log( 'App is listening!' ))
