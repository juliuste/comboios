# comboios

Client for the [Comboios de Porgual]() (CP, Portugese Railways) REST API. Inofficial, please ask CP for permission before using this module in production.

[![npm version](https://img.shields.io/npm/v/comboios.svg)](https://www.npmjs.com/package/comboios)
[![Build Status](https://travis-ci.org/juliuste/comboios.svg?branch=master)](https://travis-ci.org/juliuste/comboios)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/comboios.svg)](https://greenkeeper.io/)
[![dependency status](https://img.shields.io/david/juliuste/comboios.svg)](https://david-dm.org/juliuste/comboios)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/comboios.svg)](https://david-dm.org/juliuste/comboios#info=devDependencies)
[![license](https://img.shields.io/github/license/juliuste/comboios.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```shell
npm install --save comboios
```

## Usage

This package mostly returns data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format):

- [`stations()`](docs/stations.md) - List of operated stations
- [`departures(station, date = new Date())`](docs/departures.md) - Departures at a given station
- [`trains(trainNumber, date = new Date())`](docs/trains.md) - Schedule for a given train
- [`journeys(origin, destination, date = new Date())`](docs/journeys.md) - Journeys between stations

## See also

- [build-cp-gtfs](https://github.com/juliuste/build-cp-gtfs) - Generate CP GTFS using this module

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/comboios/issues).
