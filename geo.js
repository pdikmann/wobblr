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

function inRange( features, centerPoint, range ){
  const r = []
  for ( const feature of features ){
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

module.exports = {
  distance: distance,
  getPoint: getPoint,
  inRange: inRange
}
