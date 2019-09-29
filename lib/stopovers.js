'use strict'

const { get: getRequest } = require('./fetch')
const isString = require('lodash/isString')
const isDate = require('lodash/isDate')
const merge = require('lodash/merge')
const get = require('lodash/get')
const moment = require('moment-timezone')

const { operator, createStation, buildTripId, uicCodeFromId, timezoneAndCountry, buildDate } = require('./helpers')

const createStopovers = (sts, station, date, formattedDate) => {
	const stopovers = []
	let lastTime = 0
	for (const st of sts) {
		const stopover = {
			type: 'stopover',
			stop: station,
			tripId: buildTripId(st.trainNumber, formattedDate),
			line: {
				type: 'line',
				id: st.trainNumber + '',
				name: st.trainNumber + '',
				product: get(st, 'trainService.designation'),
				productCode: get(st, 'trainService.code'),
				mode: 'train', // @todo
				public: true,
				operator
			},
			provenance: st.trainOrigin ? createStation(st.trainOrigin) : null,
			direction: st.trainDestination ? createStation(st.trainDestination) : null,
			arrivalPlatform: st.platform ? st.platform + '' : null,
			departurePlatform: st.platform ? st.platform + '' : null
		}

		const uicCode = uicCodeFromId(stopover.stop)
		const { timezone } = timezoneAndCountry(uicCode)

		// format times
		if (st.arrivalTime) {
			const arrivalTime = +buildDate(date.format('DD.MM.YYYY'), st.arrivalTime, timezone)
			if (arrivalTime < lastTime) date.add(1, 'days')
			stopover.arrival = buildDate(date.format('DD.MM.YYYY'), st.arrivalTime, timezone).format()
			lastTime = arrivalTime
		}
		if (st.departureTime) {
			const departureTime = +buildDate(date.format('DD.MM.YYYY'), st.departureTime, timezone)
			if (departureTime < lastTime) date.add(1, 'days')
			stopover.departure = buildDate(date.format('DD.MM.YYYY'), st.departureTime, timezone).format()
			lastTime = departureTime
		}

		if (!stopover.arrival && stopover.departure) {
			stopover.arrival = stopover.departure
		} else if (stopover.arrival && !stopover.departure) {
			stopover.departure = stopover.arrival
		} else if (!stopover.arrival && !stopover.departure) {
			throw new Error('stopover must have either departure or arrival time')
		}

		stopovers.push(stopover)
	}
	return stopovers
}

const defaults = () => ({
	when: new Date()
})

const stopovers = async (station, opt = {}) => {
	if (isString(station)) station = { id: station, type: 'station' }
	if (!isString(station.id)) throw new Error('invalid or missing station id')
	if (station.type !== 'station') throw new Error('invalid or missing station type, must be station')
	station = station.id

	const options = merge({}, defaults(), opt)
	if (!isDate(options.when)) throw new Error('opt.when must be a JS date object')
	const date = moment.tz(options.when, 'Europe/Lisbon')
	const formattedDate = date.format('YYYY-MM-DD')

	const { stationStops } = await getRequest(`https://api.cp.pt/cp-api/siv/stations/${station}/timetable/${formattedDate}`)
	return createStopovers(stationStops, station, date, formattedDate)
}

module.exports = stopovers
