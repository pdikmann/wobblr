const hostname = '127.0.0.1'
const port = 3000
//
const fs = require('fs')
const express = require('express')
const app = express()
const geo = require('./geo.js') // math on longitude and latitude
const data = require('./data.js')

function busy( centerPoint, range ){
  const r = { hours: {} }
  for ( let i = 0; i < 24; i++ ){ r.hours[ i ] = [] }
  for ( const f of geo.inRange( centerPoint, range, data.daily.features )){
    const d = new Date( f.properties.time )
    r.hours[ d.getHours() ].push( f.properties.mag )
  }
  return r
}

function recent( centerPoint, range ){
  const r = { recent: [] }
  const now = Date.now()
  for ( const f of geo.inRange( centerPoint, range, data.daily.features )){
    r.recent.push({
      mag: f.properties.mag,
      distance: geo.distance( geo.getPoint( f ), centerPoint ).toFixed(1),
      time: (( now - f.properties.time ) / ( 1000 * 60 * 60 )).toFixed(1)
    })
  }
  return r
}

function recentResponse( res, place, range ){
  return () => res.send( recent( place, range || 200 ))
}

function assureCity( res, cityName, callback ){
  const city = data.findCity( cityName )
  if ( city ) callback( city ); else { res.send({ error: "city cannot be found", city: cityName })}
}

function findCityAndRespond( res, cityName, range ){
  assureCity( res, cityName, (city) => data.update( recentResponse( res, city, range )))
}

// Debug Routes
app.get('/', (req, res) => {res.send( 'Hello World' )})
app.get('/live', (req, res) => { data.update( () => res.send( data.daily ));})
app.get('/huh', (req, res) => res.send( req.query ))

// Actual Routes
app.get('/recent/:city', (req, res) => { findCityAndRespond( res, req.params.city, undefined )})

app.get('/recent/:city/:range', (req, res) => { findCityAndRespond( res, req.params.city, req.params.range )})

app.get('/recent', (req, res) => {
  if ( req.query.offline ) data.offline = true; else data.offline = false
  if ( req.query.lng && req.query.lat ){ // '/recent?lat=...&lng=...'
    data.update( recentResponse( res, { lng: req.query.lng, lat: req.query.lat }, req.query.range ))
  } else if ( req.query.city ){ // '/recent?city=...'
    findCityAndRespond( res, req.query.city, req.query.range )
  }
})

app.get('/busy/:city/:range', (req, res) => {
  assureCity( res, req.params.city, (city) => {
    data.update( () => res.send( busy( city, req.params.range )))
  })
})

app.listen( port, () => console.log( 'App is listening!' ))
