const hostname = '127.0.0.1'
const port = 3000
let offline = false
//
const geo = require('./geo.js')
const fs = require('fs')
const https = require('https')
const express = require('express')
const app = express()

function remove( thing, from ){
  return from.reduce((acc,curr) => curr !== thing ? acc.concat(curr) : acc, [])
}

function cleanLine( line ){
  return remove( '', remove( ',', line.split('"')))
}

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
  cities: [],
  daily: {},
  monthly: {},
  init: () => {
    const cityfile = fs.readFileSync( 'static/simplemaps-worldcities-basic-oc.csv', {encoding: 'utf8' })
    const citylines = cityfile.split('\n')
    data.cities = citylines.map( cleanLine )
    // TODO zip column names & row data into objects
  },
  update: callback => {
    if ( offline ){
      data.daily = JSON.parse( fs.readFileSync( 'static/all_day.geojson', {encoding: 'utf8'} ))
      console.log( "offline" )
      callback()
    } else {
      console.log( "online" )
      getDaily( daily =>{ data.daily = daily; callback()})
    }
  }
}
data.init()

function recent( centerPoint, range ){
  const r = { recent: [] }
  const now = Date.now()
  for ( f of geo.inRange( data.daily.features, centerPoint, range )){
    r.recent.push({
      mag: f.properties.mag,
      distance: geo.distance( geo.getPoint( f ), centerPoint ).toFixed(1),
      time: (( now - f.properties.time ) / ( 1000 * 60 * 60 )).toFixed(1)
    })
  }
  return r
}

app.get('/', (req, res) => {res.send( 'Hello World' )})

app.get('/live', (req, res) => {
  getDaily( body => res.send( body ));
})

app.get('/recent', (req, res) => {
  if( req.query.offline ) offline = true; else offline = false
  data.update( () =>
               res.send( recent({ lng: req.query.lng,
                                  lat: req.query.lat },
                                req.query.range)))
})

app.get('/huh', (req, res) => res.send( req.query ))

app.listen( port, () => console.log( 'App is listening!' ))
