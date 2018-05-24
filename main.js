const hostname = '127.0.0.1'
const port = 3000
//
const fs = require('fs')
const express = require('express')
const app = express()
const geo = require('./geo.js') // math on longitude and latitude
const data = require('./data.js')

function recent( centerPoint, range ){
  const r = { recent: [] }
  const now = Date.now()
  for ( f of geo.inRange( centerPoint, range, data.daily.features )){
    r.recent.push({
      mag: f.properties.mag,
      distance: geo.distance( geo.getPoint( f ), centerPoint ).toFixed(1),
      time: (( now - f.properties.time ) / ( 1000 * 60 * 60 )).toFixed(1)
    })
  }
  return r
}

// Debug Routes
app.get('/', (req, res) => {res.send( 'Hello World' )})
app.get('/live', (req, res) => { data.update( () => res.send( data.daily ));})
app.get('/huh', (req, res) => res.send( req.query ))

// Actual Routes
app.get('/recent', (req, res) => {
  if( req.query.offline ) data.offline = true; else data.offline = false
  // TODO make sure lng and lat query parameters are defined
  data.update( () =>
               res.send( recent({ lng: req.query.lng,
                                  lat: req.query.lat },
                                req.query.range || 200 )))
})

app.listen( port, () => console.log( 'App is listening!' ))
