# comboios

JavaScript client for the Portugese 🇵🇹 [Comboios de Portugal (CP)](https://www.cp.pt/) railway API. Complies with the friendly public transport format. Inofficial, using *CP* endpoints. Ask them for permission before using this module in production.

[![npm version](https://img.shields.io/npm/v/comboios.svg)](https://www.npmjs.com/package/comboios)
[![Build Status](https://travis-ci.org/juliuste/comboios.svg?branch=master)](https://travis-ci.org/juliuste/comboios)
[![license](https://img.shields.io/github/license/juliuste/comboios.svg?style=flat)](license)

## Installation

```shell
npm install comboios
```

## Usage

```javascript
const comboios = require('comboios')
```

This package contains data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

- [`stations()`](docs/stations.md) - to get a list of operated stations such as `Lisboa - Oriente` or `Viana do Castelo`
- [`journeys(origin, destination, opt)`](docs/journeys.md) - to get routes between stations
- [`stopovers(station, opt)`](docs/stopovers.md) - to get departures and arrivals at a given station
- [`trip(id)`](docs/trip.md) - to get all stopovers for a given trip (train)

## See also

- [build-cp-gtfs](https://github.com/juliuste/build-cp-gtfs) - Generate CP GTFS using this module
- [european-transport-operators](https://github.com/public-transport/european-transport-operators) - List of european long-distance transport operators, available API endpoints, GTFS feeds and client modules.

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/juliuste/comboios/issues).
