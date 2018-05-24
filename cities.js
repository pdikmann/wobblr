const fs = require('fs')

function remove( thing, from ){
  return from.reduce((acc,curr) => curr !== thing ? acc.concat(curr) : acc, [])
}

function cleanLine( line ){
  return remove( '', remove( ',', line.split('"')))
}

function zip( fields, values ){
  const r = {}
  for( i in fields ){
    r[fields[i]] = values[i]
  }
  return r
}

function fixup( city ){
  city.lng = parseFloat( city.lng )
  city.lat = parseFloat( city.lat )
  city.pop = parseInt( city.pop.replace( /,/g, ''))
  return city
}

function loadCities(){
  const lines = fs
        .readFileSync( 'static/simplemaps-worldcities-basic-oc.csv', {encoding: 'utf8' })
        .split( '\n' )
        .slice( 0, -1 ) // skip last (empty) line
        .map( cleanLine )
  const zipCity = city => zip( lines[0], city )
  return lines
    .slice(1) // skip header row
    .map( zipCity )
    .map( fixup )
}

function findCity( collection, name ){
  for( const city of collection ){
    if ( city.city_ascii == name ){ return city }
  }
  return null
}

module.exports = {
  cleanLine: cleanLine,
  findCity: findCity,
  fixup: fixup,
  loadCities: loadCities,
  remove: remove,
  zip: zip
}
