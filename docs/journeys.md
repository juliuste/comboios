# `journeys(origin, destination, date = new Date())`

Get directions and prices for routes from A to B. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve with an array of `journey`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) which looks as follows.
*Note that the results are not fully spec-compatible, as all dates are represented by JS `Date()` objects instead of ISO strings and the `schedule` is missing in legs.*

`origin` and `destination` can either be

- `station` ids like `94-2006`
- `station` objects like `{type: 'station', id: '94-30007'}`

```js
const comboios = require('comboios')

comboios.journeys('94-2006', {type: 'station', id: '94-30007', name: 'Lisboa - Santa Apolonia'}, new Date()) // Porto -> Lisbon
.then(console.log)
```

## Response

```js
[
    {
        "type": "journey",
        "id": "06.11.2017@94-2006@00:55@94-30007@05:59@3400@05h04",
        "legs": [
            {
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
                "departurePlatform": null,
                "arrivalPlatform": null,
                "trainNumber": 3400,
                "service": {
                    "name": "Regional",
                    "code": "R"
                },
                "mode": "train",
                "public": true,
                "operator": {
                    "type": "operator",
                    "id": "cp",
                    "name": "Comboios de Portugal",
                    "url": "https://www.cp.pt/"
                },
                "arrival": "2017-11-04T05:59:00.000Z",
                "departure": "2017-11-06T00:55:00.000Z",
                "stops": [
                    {
                        "type": "station",
                        "id": "94-2006",
                        "name": "Porto - Campanha",
                        "platform": null,
                        "arrival": "2017-11-05T00:55:00.000Z",
                        "departure": "2017-11-05T00:55:00.000Z"
                    },
                    {
                        "type": "station",
                        "id": "94-39164",
                        "name": "Vila Nova de Gaia-Devesas",
                        "platform": null,
                        "arrival": "2017-11-05T01:00:00.000Z",
                        "departure": "2017-11-05T01:01:00.000Z"
                    },
                    // …
                    {
                        "type": "station",
                        "id": "94-30007",
                        "name": "Lisboa - Santa Apolonia",
                        "platform": null,
                        "arrival": "2017-11-05T05:59:00.000Z",
                        "departure": "2017-11-06T00:00:00.000Z"
                    }
                ]
            }
        ],
        "price": {
            "class": 2,
            "amount": 18.15,
            "currency": "EUR",
            "fareType": 1,
            "saleURL": null
        }
    }
]
```
