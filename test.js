'use strict'

const tapeWithoutPromise = require('tape')
const addPromiseSupport = require('tape-promise').default
const tape = addPromiseSupport(tapeWithoutPromise)
const isString = require('lodash/isString')
const moment = require('moment-timezone')
const validate = require('validate-fptf')()
const isUicLocationCode = require('is-uic-location-code')

const comboios = require('.')

const isCP = (o) => o.type === 'operator' && o.id === 'cp' && o.name === 'Comboios de Portugal' && o.url === 'https://www.cp.pt/'

const portoCampanha = '94-2006'
const vianaDoCastelo = '94-18002'
const lisboaSantaApolonia = '94-30007'
const when = moment.tz('Europe/Lisbon').add(3, 'days').startOf('day').add(9, 'hours').toDate()

tape('comboios.stations', async t => {
	const stations = await comboios.stations()
	t.ok(Array.isArray(stations), 'type')
	t.ok(stations.length > 100, 'length')
	stations.forEach(station => {
		t.doesNotThrow(() => validate(station), 'valid fptf')
		t.ok(isUicLocationCode(station.uicId), 'uicId')
		t.ok(station.country.length === 2, 'country')
		t.ok(!!moment.tz.zone(station.timezone), 'timezone')
	})
	const porto = stations.filter((x) => x.name.indexOf('Porto') >= 0)
	t.ok(porto.length >= 3, 'porto stations')
	t.ok(porto.every(p => p.timezone === 'Europe/Lisbon'), 'porto timezones')

	const madrid = stations.filter((x) => x.name.indexOf('Madrid') >= 0)
	t.ok(madrid.length >= 1, 'madrid stations')
	t.ok(madrid.every(p => p.timezone === 'Europe/Madrid'), 'madrid timezones')
})

tape('comboios.journeys', async t => {
	const journeys = await comboios.journeys(lisboaSantaApolonia, portoCampanha, { when })
	t.ok(Array.isArray(journeys), 'type')
	t.ok(journeys.length >= 2, 'length')
	journeys.forEach(journey => {
		t.doesNotThrow(() => validate(journey), 'journey: valid fptf')
		journey.legs.forEach(leg => {
			t.ok(leg.mode === 'train', 'leg mode')
			t.ok(isCP(leg.operator), 'leg operator')
			t.doesNotThrow(() => validate(leg.line), 'line: valid fptf')
			t.ok(leg.line.mode === 'train', 'leg line mode')
			t.ok(isCP(leg.line.operator), 'leg line operator')
			t.ok(isString(leg.line.product) && leg.line.product.length > 0, 'product')
			t.ok(isString(leg.line.productCode) && leg.line.productCode.length > 0, 'product code')
		})
	})
	t.ok(journeys.some(journey => !!journey.price), 'has price')
})

tape('comboios.trip', async t => {
	const [journey] = await comboios.journeys(portoCampanha, vianaDoCastelo, { when })
	t.ok(journey && journey.type === 'journey', 'precondition')
	t.doesNotThrow(() => validate(journey), 'precondition')
	const { tripId } = journey.legs[0]
	t.ok(isString(tripId) && tripId.length > 0, 'precondition')

	const trip = await (comboios.trip(tripId).catch(console.error))
	t.ok(trip.id === tripId, 'id')
	t.ok(trip.line && trip.line.type === 'line', 'line')
	t.doesNotThrow(() => validate(trip.line), 'line: valid fptf')
	t.ok(Array.isArray(trip.stopovers) && trip.stopovers.length >= 2, 'stopovers')
	trip.stopovers.forEach(stopover => {
		t.ok(stopover && stopover.type === 'stopover', 'stopover')
		t.doesNotThrow(() => validate(stopover), 'stopover: valid fptf')
	})
})

tape('comboios.stopovers', async t => {
	const stopovers = await comboios.stopovers(portoCampanha, { when })
	t.ok(Array.isArray(stopovers), 'type')
	t.ok(stopovers.length >= 10, 'length')
	stopovers.forEach(stopover => {
		t.doesNotThrow(() => validate(stopover), 'stopover: valid fptf')
		t.ok(isString(stopover.tripId) && stopover.tripId.length > 0, 'tripId')
		t.doesNotThrow(() => validate(stopover.line), 'line: valid fptf')
		t.ok(stopover.line.mode === 'train', 'stopover line mode')
		t.ok(isCP(stopover.line.operator), 'stopover line operator')
		t.ok(isString(stopover.line.product) && stopover.line.product.length > 0, 'product')
		t.ok(isString(stopover.line.productCode) && stopover.line.productCode.length > 0, 'product code')
		if (stopover.provenance) {
			t.ok(stopover.provenance.type === 'station', 'provenance type')
			t.doesNotThrow(() => validate(stopover.provenance), 'provenance: valid fptf')
		}
		if (stopover.direction) {
			t.ok(stopover.direction.type === 'station', 'direction type')
			t.doesNotThrow(() => validate(stopover.direction), 'direction: valid fptf')
		}
	})
	t.ok(stopovers.some(st => !!st.provenance), 'has provenance')
	t.ok(stopovers.some(st => !!st.direction), 'has direction')
})
