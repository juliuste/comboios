'use strict'

const { post: postRequest } = require('./fetch')
const isString = require('lodash/isString')
const isDate = require('lodash/isDate')
const sortBy = require('lodash/sortBy')
const get = require('lodash/get')
const pick = require('lodash/pick')
const merge = require('lodash/merge')
const moment = require('moment')
require('moment-duration-format')
const momentTz = require('moment-timezone') // cheap hack for moment-duration-format fail

const { operator, createStation, buildTripId } = require('./helpers')

const createPrice = (j) => (p) => ({
	class: +p.travelClass,
	amount: +p.centsValue / 100,
	currency: 'EUR',
	fareType: p.priceType,
	url: (j.saleLink && j.saleLink.code) ? j.saleLink.code : null // todo: saleableOnline
})

const hashLegs = legs => legs.map(leg => [leg.tripId, leg.origin.id, leg.destination.id].join('@')).join('-')

const createJourney = (date, formattedDate) => (j) => {
	// legs
	let lastTime = 0
	const legs = []
	const sections = sortBy(j.travelSections, (x) => x.sequenceNumber)
	for (let section of sections) {
		const leg = {
			tripId: buildTripId(section.trainNumber, formattedDate),
			origin: createStation(section.departureStation),
			destination: createStation(section.arrivalStation),
			departurePlatform: section.departurePlatform,
			arrivalPlatform: section.arrivalPlatform,
			line: {
				type: 'line',
				id: section.trainNumber + '',
				name: section.trainNumber + '',
				product: get(section, 'serviceCode.designation'),
				productCode: get(section, 'serviceCode.code'),
				mode: 'train', // @todo
				public: true,
				operator
			},
			mode: 'train', // todo
			public: true,
			operator
		}

		// departure time
		const departureTime = +moment.duration(section.departureTime)
		if (departureTime < lastTime) date.add(1, 'days')
		leg.departure = moment.tz(date.format('DD.MM.YYYY') + ' ' + section.departureTime, 'DD.MM.YYYY HH:mm', leg.origin.timezone).format()
		lastTime = departureTime

		const stopovers = []
		for (let s of section.trainStops) {
			const stopover = {
				type: 'stopover',
				stop: createStation(s.station),
				arrivalPlatform: s.platform ? s.platform + '' : null,
				departurePlatform: s.platform ? s.platform + '' : null
			}

			if (!s.arrival && !s.departure) throw new Error('stopover must have either departure or arrival time')
			if (!s.arrival && s.departure) s.arrival = s.departure
			if (!s.departure && s.arrival) s.departure = s.arrival
			const arrivalTime = +moment.duration(s.arrival)
			if (arrivalTime < lastTime) date.add(1, 'days')
			stopover.arrival = moment.tz(date.format('DD.MM.YYYY') + ' ' + s.arrival, 'DD.MM.YYYY HH:mm', stopover.stop.timezone).format()
			lastTime = arrivalTime
			const departureTime = +moment.duration(s.departure)
			if (departureTime < lastTime) date.add(1, 'days')
			stopover.departure = moment.tz(date.format('DD.MM.YYYY') + ' ' + s.departure, 'DD.MM.YYYY HH:mm', stopover.stop.timezone).format()
			lastTime = departureTime

			// sort keys
			stopovers.push(pick(stopover, ['type', 'stop', 'arrival', 'arrivalPlatform', 'departure', 'departurePlatform']))
		}

		// arrival time
		const arrivalTime = +moment.duration(section.arrivalTime)
		if (arrivalTime < lastTime) date.add(1, 'days')
		leg.arrival = moment.tz(date.format('DD.MM.YYYY') + ' ' + section.arrivalTime, 'DD.MM.YYYY HH:mm', leg.destination.timezone).format()
		lastTime = arrivalTime

		leg.stopovers = stopovers

		// sort keys
		legs.push(pick(leg, ['tripId', 'origin', 'destination', 'departure', 'departurePlatform', 'arrival', 'arrivalPlatform', 'line', 'mode', 'public', 'operator', 'stopovers']))
	}

	const journey = {
		type: 'journey',
		id: hashLegs(legs),
		legs
	}

	// prices
	const prices = j.basePrices.map(createPrice(j)).filter((x) => x.amount > 0)
	const sortedPrices = sortBy(prices, 'amount')
	if (sortedPrices.length > 0) {
		journey.price = {
			...prices[0],
			fares: prices
		}
	}

	return journey
}

const defaults = () => ({
	when: new Date()
})

const journeys = async (origin, destination, opt = {}) => {
	if (isString(origin)) origin = { id: origin, type: 'station' }
	if (isString(destination)) destination = { id: destination, type: 'station' }
	if (!isString(origin.id)) throw new Error('invalid or missing origin id')
	if (origin.type !== 'station') throw new Error('invalid or missing origin type, must be station')
	if (!isString(destination.id)) throw new Error('invalid or missing destination id')
	if (destination.type !== 'station') throw new Error('invalid or missing destination type, must be station')

	origin = origin.id
	destination = destination.id

	const options = merge({}, defaults(), opt)
	if (!isDate(options.when)) throw new Error('opt.when must be a JS date object')
	const date = momentTz.tz(options.when, 'Europe/Lisbon')
	const formattedDate = date.format('YYYY-MM-DD')

	const { outwardTrip } = await postRequest('https://api.cp.pt/cp-api/siv/travel/search', {
		departureStationCode: origin,
		arrivalStationCode: destination,
		classes: [1, 2], // todo
		searchType: 3,
		travelDate: formattedDate,
		returnDate: null, // todo
		timeLimit: null
	})
	return outwardTrip.map(createJourney(date, formattedDate)) // todo: check if date = res.travelDate
}

module.exports = journeys
