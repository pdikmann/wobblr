const hostname = '127.0.0.1'
const port = 3000
//
const fs = require('fs')
const http = require('http')
const express = require('express')
const app = express()

function remove( thing, from ){
  return from.reduce((acc,curr) => curr !== thing ? acc.concat(curr) : acc, [])
}

function cleanLine( line ){
  return remove( '', remove( ',', line.split('"')))
}

const data = {
  cities: [],
  daily: {},
  monthly: {},
  update: () => {
    const contents = fs.readFileSync( 'static/all_day.geojson', {encoding: 'utf8'} )
    data.daily = JSON.parse( contents )
    const cityfile = fs.readFileSync( 'static/simplemaps-worldcities-basic-oc.csv', {encoding: 'utf8' })
    const citylines = cityfile.split('\n')
    data.cities = citylines.map( cleanLine )
    // TODO zip column names & row data into objects
    // console.log( "updated!" )
  }
}

// https://stackoverflow.com/questions/24680247/check-if-a-latitude-and-longitude-is-within-a-circle-google-maps
function distance( checkPoint, centerPoint ){
  var ky = 40000 / 360;
  var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky
  var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx
  var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky
  return Math.sqrt(dx * dx + dy * dy)
}

// https://stackoverflow.com/questions/24680247/check-if-a-latitude-and-longitude-is-within-a-circle-google-maps
function arePointsNear(checkPoint, centerPoint, km) {
  return distance( checkPoint, centerPoint ) <= km
}

function inRange( centerPoint, range ){
  const r = []
  for ( const feature of data.daily.features ){
    if ( arePointsNear( getPoint( feature ), centerPoint, range )){
      r.push( feature ) 
    }
  }
  return r
}

function getPoint( feature ){
  return { lng: feature.geometry.coordinates[0],
           lat: feature.geometry.coordinates[1] }
}

function recent( centerPoint, range ){
  const r = { recent: [] }
  const features = inRange( centerPoint, range )
  const now = Date.now()
  for ( f of features ){
    r.recent.push({
      mag: f.properties.mag,
      distance: distance( getPoint( f ), centerPoint ).toFixed(1),
      time: (( now - f.properties.time ) / ( 1000 * 60 * 60 )).toFixed(1)
    })
  }
  return r
}

app.get('/', (req, res) => {res.send( 'Hello World' )})

app.get('/recent', (req, res) => {
  data.update()
  res.send( recent({ lng: req.query.lng,
                      lat: req.query.lat },
                   req.query.range))
})

app.get('/huh', (req, res) => res.send( req.query ))

app.listen( port, () => console.log( 'App is listening!' ))
