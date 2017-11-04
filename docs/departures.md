# `departures(station, date = new Date())`

Get departures at a given station for a given date. Ignores the time and returns all departures for the given day in timezone `Europe/Lisbon`. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in a list of `departure` objects.

`station` can either be

- `station` id like `94-2006`
- `station` object like `{type: 'station', id: '94-2006'}`

```js
const comboios = require('comboios')

comboios.departures('94-2006', new Date()) // Porto Campanha
.then(console.log)
```

## Response

```js
[
    {
        "type": "departure",
        "trainNumber": 15180,
        "service": {
            "name": "Urbano",
            "code": "U"
        },
        "origin": {
            "type": "station",
            "id": "94-24000",
            "name": "Guimaraes"
        },
        "destination": {
            "type": "station",
            "id": "94-1008",
            "name": "Porto - Sao Bento"
        },
        "platform": null,
        "arrival": "2017-11-04T00:00:00.000Z",
        "departure": "2017-11-04T00:01:00.000Z"
    },
    {
        "type": "departure",
        "trainNumber": 3400,
        "service": {
            "name": "Regional",
            "code": "R"
        },
        "origin": {
            "type": "station",
            "id": "94-2006",
            "name": "Porto - Campanha"
        },
        "destination": {
            "type": "station",
            "id": "94-30007",
            "name": "Lisboa - Santa Apolonia"
        },
        "platform": null,
        "departure": "2017-11-05T00:55:00.000Z",
        "arrival": "2017-11-05T00:55:00.000Z"
    }
    // …
]
```
