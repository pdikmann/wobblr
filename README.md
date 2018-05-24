# API Endpoints

## Recent Earthquakes in Area

Finds the most recent Earthquakes in a particular area:

`/recent?city=<city name>&range=<radius>`
`/recent?lat=<lat>&lng=<lng>&range=<radius>`

Radius defaults to 200km.

Returns JSON:
```
{ recent: [
    { mag: Float
      distance: Float // im km
      time: Integer   // in "Minutes ago"
    } ...
]}
```

## Busy Hours

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

## Cycle

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
