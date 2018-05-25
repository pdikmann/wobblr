# Usage

## Dependencies

- an installation of [NodeJS](https://nodejs.org/en/)
- accompanied by [NPM](https://www.npmjs.com/)

## Start Service

```
npm install
node main.js
```

then:

```
curl "http://localhost:3000/recent/Honolulu/400"
or
curl "http://localhost:3000/recent?city=Honolulu&range=400"
or
curl "http://localhost:3000/recent?lng=-115.6176667&lat=33.1545"
=> {"recent":[{"mag":0.67,"distance":"116.3","time":"0.3"}, ...

```

## Run Tests

```
npm test
```

# API Endpoints

## Recent Earthquakes in Area

Finds the most recent Earthquakes in a particular area:

`/recent/city[/range]`
- `city`: name of city
- `range` (optional): furthest distance to consider, in kilometers

`/recent?city=...[&range=...]`
- `city`: name of city
- `range` (optional): furthest distance to consider, in kilometers

`/recent?lat=...&lng=...[&range=...]`
- `lat`: latitude of area
- `lng`: longitude of area
- `range` (optional): furthest distance to consider, in kilometers

`range` defaults to 200km.

Returns JSON:
```
{ recent: [
    { mag: Float
      distance: Float // im km
      time: Integer   // in "Hours ago"
    } ...
]}
```
... or an Error:
```
{ error: "city cannot be found", 
  city: cityName }
```

## Busy Hours (WIP)

Returns 24 Arrays of magnitudes of earthquakes occuring within an area within a time frame,
partitioned into 24 hour slots

`/busy?city=<city name>&range=<radius>&period=<time>`

Radius defaults to 200km, Period defaults to 7 days.

Return JSON:
```
{ hours: {
    0: [ Float, ...] // list of magnitudes
    ...
    23: [ Float, ...]
    }
}
```

## Cycle (WIP)

Attempts to find the shortest time period in which earthquake occurences appears to repeat -
e.g. the frequency of earthquakes.

`/cycle?city=<city name>&range=<radius>`


```
{ cycle: {
    period: Integer       // in Days
    phase: Float          // position of current Date in period
    occurences: {
        0: [ Float, ... ] // list of magnitudes
        ...
        n: [ Float, ... ] // n == cycle.length - 1
    }
}
```

# Notes / Credits

- Past Day Feed: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
- Past 30 Days Feed: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
- City GeoLocation DB used: https://simplemaps.com/data/world-cities
