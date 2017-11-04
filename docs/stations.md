# `stations()`

Get a list of all operated stations. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in an array of `station`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format). (_This request may take a few seconds._)

```js
const comboios = require('comboios')

comboios.stations()
.then(console.log)
```

## Response

```js
[
    {
        "type": "station",
        "id": "94-52001",
        "name": "Abrantes",
        "coordinates": {
            "longitude": -8.19376659393311,
            "latitude": 39.4396858215332
        }
    },
    {
        "type": "station",
        "id": "94-48124",
        "name": "Abrunhosa",
        "coordinates": {
            "longitude": -7.64854621887207,
            "latitude": 40.5728874206543
        }
    },
    {
        "type": "station",
        "id": "94-36046",
        "name": "Ademia",
        "coordinates": {
            "longitude": -8.45053958892822,
            "latitude": 40.2503356933594
        }
    }
    // …
]
```
