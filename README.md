# API Endpoints

## Recent Earthquakes in Area

Finds the most recent Earthquakes in a particular area:

`/recent/<city name>/<radius>`
`/recent/<lat>/<lng>/<radius>`

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

`/busy/<city name>/`
`/busy/<city name>/<radius>/<time>`

Radius defaults to 200km, Time defaults to 7 days.

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

`/cycle/<city name>`
`/cycle?city=<city name>`
`/cycle?city=CITY-NAME&range=RADIUS`


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

# Credits

- City GeoLocation DB used: https://simplemaps.com/data/world-cities
