# `stations()`

Get a list of all operated stations such as `Lisboa - Oriente` or `Viana do Castelo`. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in an array of `station`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format). (_This request may take a few seconds._)

```js
const comboios = require('comboios')

comboios.stations()
.then(console.log)
.catch(console.error)
```

## Response

```js
[
    {
        "type": "station",
        "id": "94-52001",
        "uicId": "9452001",
        "name": "Abrantes",
        "location": {
            "type": "location",
            "longitude": -8.19376659393311,
            "latitude": 39.4396858215332
        },
        "timezone": "Europe/Lisbon",
        "country": "PT"
    },
    {
        "type": "station",
        "id": "94-36046",
        "uicId": "9436046",
        "name": "Ademia",
        "location": {
            "type": "location",
            "longitude": -8.45053958892822,
            "latitude": 40.2503356933594
        },
        "timezone": "Europe/Lisbon",
        "country": "PT"
    },
    {
        "type": "station",
        "id": "94-18119",
        "uicId": "9418119",
        "name": "Afife",
        "location": {
            "type": "location",
            "longitude": -8.86222076416016,
            "latitude": 41.7782096862793
        },
        "timezone": "Europe/Lisbon",
        "country": "PT"
    }
    // …
]
```
