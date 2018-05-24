const hostname = '127.0.0.1'
const port = 3000
//
const fs = require('fs')
const http = require('http')
const express = require('express')

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

const contents = fs.readFileSync( 'all_day.geojson', {encoding: 'utf8'} )
const data = JSON.parse( contents )
const view = data.features.map( f => [f.properties.place, f.properties.mag, '<br>' ])

const places = data.features.map( f => f.properties.place.replace( /.*? of /, '' ))

// ================================================================================


const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end( places.toString() )
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
