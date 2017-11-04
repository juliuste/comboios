# `trains(trainNumber, date = new Date())`

Get timetable for a given train number and date. Ignores the time and returns the schedule for the given day in timezone `Europe/Lisbon`. Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in a timetable object.

```js
const comboios = require('comboios')

comboios.trains(3400, new Date())
.then(console.log)
```

## Response

```js
{
    "trainNumber": 3400,
    "service": {
        "name": "Regional",
        "code": "R"
    },
    "stops": [
        {
            "type": "station",
            "id": "94-2006",
            "name": "Porto - Campanha",
            "platform": null,
            "arrival": "2017-11-04T00:00:00.000Z",
            "departure": "2017-11-04T00:55:00.000Z"
        },
        {
            "type": "station",
            "id": "94-39164",
            "name": "Vila Nova de Gaia-Devesas",
            "platform": null,
            "arrival": "2017-11-04T01:00:00.000Z",
            "departure": "2017-11-04T01:01:00.000Z"
        },
        {
            "type": "station",
            "id": "94-39008",
            "name": "Espinho",
            "platform": null,
            "arrival": "2017-11-04T01:12:00.000Z",
            "departure": "2017-11-04T01:13:00.000Z"
        }
        // …
    ]
}
```
