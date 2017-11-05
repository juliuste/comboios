'use strict'

const tape = require('tape')
const comboios = require('./index')
const isString = require('lodash.isstring')
const isNumber = require('lodash.isnumber')
const isDate = require('lodash.isdate')
const isObject = require('lodash.isobject')
const moment = require('moment-timezone')

const isStation = (s) => s.type === 'station' && isString(s.id) && s.id.length > 4 && isString(s.name) && s.name.length > 1 // && isNumber(s.coordinates.longitude) && isNumber(s.coordinates.latitude)
const isTrainStop = (s) => isStation(s) && isDate(s.arrival) && isDate(s.departure) && +s.departure >= +s.arrival

const isCP = (o) => o.type === 'operator' && o.id === 'cp' && o.name === 'Comboios de Portugal' && o.url === 'https://www.cp.pt/'

tape('comboios', async (t) => {
	// stations
	const stations = await comboios.stations()
	t.ok(stations.length > 100, 'stations length')
	const porto = stations.find((x) => x.name.indexOf('Porto')>=0)
	t.ok(porto.type === 'station', 'station type')
	t.ok(isString(porto.id) && porto.id.length > 4, 'station id')
	t.ok(isString(porto.name) && porto.name.length > 4, 'station name')
	t.ok(isNumber(porto.coordinates.longitude) && porto.coordinates.longitude < 0, 'station coordinates longitude')
	t.ok(isNumber(porto.coordinates.latitude) && porto.coordinates.latitude > 0, 'station coordinates latitude')

	// departures
	const date = moment.tz('Europe/Lisbon').add(3, 'days').toDate()
	const departures = await comboios.departures(porto, date)
	t.ok(departures.length > 2, 'departures length')
	const departure = departures.find((x) => isObject(x.service))
	t.ok(departure.type === 'departure', 'departure type')
	t.ok(isNumber(departure.trainNumber), 'departure trainNumber')
	t.ok(isString(departure.service.code) && departure.service.code.length > 0, 'departure service code')
	t.ok(isString(departure.service.name) && departure.service.name.length > 0, 'departure service name')
	t.ok(isStation(departure.origin), 'departure origin')
	t.ok(isStation(departure.destination), 'departure destination')
	t.ok(isDate(departure.arrival), 'departure arrival')
	t.ok(isDate(departure.departure), 'departure departure')
	t.ok(+departure.arrival <= +departure.departure, 'departure arrival < departure')


	// trains
	const train = await comboios.trains(departure.trainNumber, date)
	t.ok(isNumber(train.trainNumber), 'train trainNumber')
	t.ok(isString(train.service.code) && train.service.code.length > 0, 'train service code')
	t.ok(isString(train.service.name) && train.service.name.length > 0, 'train service name')
	t.ok(train.stops.every(isTrainStop), 'train stops')

	// journeys
	const lisboa = stations.find((x) => x.name.indexOf('Lisboa')>=0)
	const journeys = await comboios.journeys(lisboa, porto, date)
	t.ok(journeys.length >= 1, 'journeys length')
	const journey = journeys[0]
	t.ok(journey.type === 'journey', 'journey type')
	if(isObject(journey.price)){
		t.ok(isNumber(journey.price.amount) && journey.price.amount > 0, 'journey price amount')
		t.ok(journey.price.currency === 'EUR', 'journey price currency')
		t.ok(isNumber(journey.price.class) && journey.price.class > 0, 'journey price class')
		// todo: price.fares
	}
	t.ok(journey.legs.length >= 1, 'journey legs length')
	const leg = journey.legs.find((x) => isObject(x.service))
	t.ok(isStation(leg.origin), 'journey leg origin')
	t.ok(isStation(leg.destination), 'journey leg destination')
	t.ok(isDate(leg.arrival), 'journey leg arrival')
	t.ok(isDate(leg.departure), 'journey leg departure')
	t.ok(+leg.arrival >= +leg.departure, 'journey leg arrival > departure')
	t.ok(isNumber(leg.trainNumber), 'journey leg trainNumber')
	t.ok(isString(leg.service.code) && leg.service.code.length > 0, 'journey leg service code')
	t.ok(isString(leg.service.name) && leg.service.name.length > 0, 'journey leg service name')
	t.ok(leg.stops.every(isTrainStop), 'journey leg stops')
	t.ok(isCP(leg.operator), 'journey leg operator')
	t.ok(leg.mode === 'train', 'journey leg mode')
	t.ok(leg.public === true, 'journey leg public')

	t.end()
})
