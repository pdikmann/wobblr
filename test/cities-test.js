const assert = require( 'assert' )

describe( 'sanity', () => {
  it( 'should be preserved', () => {
    assert.equal( true, true )
  })
})

const cities = require( '../cities.js' )

describe( 'zip', ()=>{
  it( 'creates an object from fields and values', ()=>{
    assert.deepStrictEqual( cities.zip( ['a'], [1] ), 
                            { a: 1 })
  })
  it( 'preserves the order of fields and values', ()=>{
    assert.deepStrictEqual( cities.zip( ['a', 'b', 'c'], 
                                        [1, 2, 3] ), 
                            { a: 1,
                              b: 2,
                              c: 3 })
  })
})

describe( 'remove', () => {
  it( 'removes things from arrays', () => {
    assert.deepStrictEqual( cities.remove( 1, [1, 2, 3]),
                            [2, 3])
  })
  it( 'removes multiple things', () => {
    assert.deepStrictEqual( cities.remove( null, [1, null, 2, 3, null]),
                            [1, 2, 3])
  })
})

describe( 'cleanLine', () => {
  it( 'splits strings at quotes (") and removes commata (,) or empty strings (\'\').', () => {
    assert.deepStrictEqual( cities.cleanLine( '"a","b","c"'),
                            ['a', 'b', 'c'])
  })
  it( 'ignores commas that precede/trail longer strings', () => {
    assert.deepStrictEqual( cities.cleanLine( '"x",123,"y"'),
                            ['x', ',123,', 'y'])
  })
})

describe( 'fixup', () => {
  it( 'parses selected object properties as numbers', () => {
    assert.deepStrictEqual( cities.fixup({ lng: "1.2",
                                           lat: "3.4",
                                           pop: ",567," }),
                            { lng: 1.2,
                              lat: 3.4,
                              pop: 567 })
  })
})

describe( 'findCity', () => {
  let collection = cities.loadCities()
  console.log( collection.length )
  it( 'can find existing cities in a given collection by their name', () => {
    assert.deepStrictEqual( cities.findCity( collection, "New York" ),
                            {"city": "New York",
                             "city_ascii": "New York",
                             "country": "United States of America",
                             "iso2": "US",
                             "iso3": "USA",
                             "lat": 40.74997906,
                             "lng": -73.98001693,
                             "pop": 13524139,
                             "province": "New York" })
  })
  it( 'returns null when a city cannot be found', () => {
    assert.deepStrictEqual( cities.findCity( collection, "Atlantis" ), null)
  })
})
