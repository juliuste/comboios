# `stopovers(station, opt = {})`

Get departures and arrivals at a given station. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in a list of `stopover` objects.

`station` can either be

- `station` id like `94-2006`
- `station` object like `{type: 'station', id: '94-2006'}`

With `opt`, you can override the default options, which look like this:

```js
{
    when: new Date() // JS Date object
}
```

Note that the method will ignore the exact time of `opt.when` and return all departures and arrivals for the entire day in timezone `Europe/Lisbon`.

```js
const comboios = require('comboios')

const portoCampanha = '94-2006'
comboios.stopovers(portoCampanha, { when: new Date('2019-05-09T09:00:00') })
.then(console.log)
.catch(console.error)
```

## Response

```js
[
    {
        "type": "stopover",
        "stop": "94-2006",
        "tripId": "15180@2019-05-09",
        "line": {
            "type": "line",
            "id": "15180",
            "name": "15180",
            "product": "Urbano",
            "productCode": "U",
            "mode": "train",
            "public": true,
            "operator": {
                "type": "operator",
                "id": "cp",
                "name": "Comboios de Portugal",
                "url": "https://www.cp.pt/"
            }
        },
        "provenance": {
            "type": "station",
            "id": "94-24000",
            "name": "Guimaraes"
        },
        "direction": {
            "type": "station",
            "id": "94-1008",
            "name": "Porto - Sao Bento"
        },
        "arrivalPlatform": null,
        "departurePlatform": null,
        "arrival": "2019-05-08T23:00:00.000Z",
        "departure": "2019-05-08T23:01:00.000Z"
    },
    // …
    {
        "type": "stopover",
        "stop": "94-2006",
        "tripId": "15434@2019-05-09",
        "line": {
            "type": "line",
            "id": "15434",
            "name": "15434",
            "product": "Urbano",
            "productCode": "U",
            "mode": "train",
            "public": true,
            "operator": {
                "type": "operator",
                "id": "cp",
                "name": "Comboios de Portugal",
                "url": "https://www.cp.pt/"
            }
        },
        "provenance": {
            "type": "station",
            "id": "94-8318",
            "name": "Penafiel"
        },
        "direction": {
            "type": "station",
            "id": "94-1008",
            "name": "Porto - Sao Bento"
        },
        "arrivalPlatform": null,
        "departurePlatform": null,
        "arrival": "2019-06-26T22:55:00.000Z",
        "departure": "2019-06-26T22:56:00.000Z"
    }
]
```
