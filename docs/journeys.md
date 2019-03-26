# `journeys(origin, destination, opt = {})`

Get directions and prices for routes from A to B. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve with an array of `journey`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) which looks as follows.

`origin` and `destination` can either be

- `station` ids like `94-2006`
- `station` objects like `{type: 'station', id: '94-30007'}`

With `opt`, you can override the default options, which look like this:

```js
{
    when: new Date() // JS Date object
}
```

```js
const comboios = require('comboios')

const porto = '94-2006'
const lisboa = {
    type: 'station',
    id: '94-30007',
    name: 'Lisboa - Santa Apolonia'
}

comboios.journeys(porto, lisboa, { when: new Date('2019-05-09T09:00:00') })
.then(console.log)
.catch(console.error)
```

## Response

```js
[
    {
        "type": "journey",
        "id": "3400@2019-05-09@94-2006@94-30007",
        "legs": [
            {
                "tripId": "3400@2019-05-09",
                "origin": {
                    "type": "station",
                    "id": "94-2006",
                    "uicId": "9402006",
                    "name": "Porto - Campanha",
                    "timezone": "Europe/Lisbon",
                    "country": "PT"
                },
                "destination": {
                    "type": "station",
                    "id": "94-30007",
                    "uicId": "9430007",
                    "name": "Lisboa - Santa Apolonia",
                    "timezone": "Europe/Lisbon",
                    "country": "PT"
                },
                "departure": "2019-05-08T23:55:00.000Z",
                "departurePlatform": null,
                "arrival": "2019-05-10T04:59:00.000Z",
                "arrivalPlatform": null,
                "line": {
                    "type": "line",
                    "id": "3400",
                    "name": "3400",
                    "product": "Regional",
                    "productCode": "R",
                    "mode": "train",
                    "public": true,
                    "operator": {
                        "type": "operator",
                        "id": "cp",
                        "name": "Comboios de Portugal",
                        "url": "https://www.cp.pt/"
                    }
                },
                "mode": "train",
                "public": true,
                "operator": {
                    "type": "operator",
                    "id": "cp",
                    "name": "Comboios de Portugal",
                    "url": "https://www.cp.pt/"
                },
                "stopovers": [
                    {
                        "type": "stopover",
                        "stop": {
                            "type": "station",
                            "id": "94-2006",
                            "uicId": "9402006",
                            "name": "Porto - Campanha",
                            "timezone": "Europe/Lisbon",
                            "country": "PT"
                        },
                        "arrival": "2019-05-08T23:55:00.000Z",
                        "arrivalPlatform": null,
                        "departure": "2019-05-08T23:55:00.000Z",
                        "departurePlatform": null
                    },
                    {
                        "type": "stopover",
                        "stop": {
                            "type": "station",
                            "id": "94-39172",
                            "uicId": "9439172",
                            "name": "General Torres",
                            "timezone": "Europe/Lisbon",
                            "country": "PT"
                        },
                        "arrival": "2019-05-08T23:58:00.000Z",
                        "arrivalPlatform": null,
                        "departure": "2019-05-08T23:59:00.000Z",
                        "departurePlatform": null
                    },
                    // …
                    {
                        "type": "stopover",
                        "stop": {
                            "type": "station",
                            "id": "94-30007",
                            "uicId": "9430007",
                            "name": "Lisboa - Santa Apolonia",
                            "timezone": "Europe/Lisbon",
                            "country": "PT"
                        },
                        "arrival": "2019-05-09T04:59:00.000Z",
                        "arrivalPlatform": null,
                        "departure": "2019-05-09T23:00:00.000Z",
                        "departurePlatform": null
                    }
                ]
            }
        ],
        "price": {
            "class": 2,
            "amount": 18.4,
            "currency": "EUR",
            "fareType": 1,
            "url": null,
            "fares": [
                {
                    "class": 2,
                    "amount": 18.4,
                    "currency": "EUR",
                    "fareType": 1,
                    "url": null
                }
            ]
        }
    }
    // …
]
```
