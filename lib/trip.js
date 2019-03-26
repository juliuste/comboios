'use strict'

const { get: getRequest } = require('./fetch')
const get = require('lodash/get')
const pick = require('lodash/pick')
const isString = require('lodash/isString')
const moment = require('moment')
require('moment-duration-format')
const momentTz = require('moment-timezone') // cheap hack for moment-duration-format fail

const { operator, createStation, splitTripId } = require('./helpers')

const createStopovers = (sts, date) => {
	const stopovers = []
	let lastTime = 0
	for (let st of sts) {
		const stopover = {
			type: 'stopover',
			stop: createStation(st.station),
			arrivalPlatform: st.platform ? st.platform + '' : null,
			departurePlatform: st.platform ? st.platform + '' : null
		}

		// format times
		if (!st.arrival && !st.departure) throw new Error('stopover must have either departure or arrival time')
		if (!st.arrival && st.departure) st.arrival = st.departure
		if (!st.departure && st.arrival) st.departure = st.arrival
		const arrivalTime = +moment.duration(st.arrival)
		if (arrivalTime < lastTime) date.add(1, 'days')
		stopover.arrival = moment.tz(date.format('DD.MM.YYYY') + ' ' + st.arrival, 'DD.MM.YYYY HH:mm', stopover.stop.timezone).format()
		lastTime = arrivalTime
		const departureTime = +moment.duration(st.departure)
		if (departureTime < lastTime) date.add(1, 'days')
		stopover.departure = moment.tz(date.format('DD.MM.YYYY') + ' ' + st.departure, 'DD.MM.YYYY HH:mm', stopover.stop.timezone).format()
		lastTime = departureTime

		// sort keys
		stopovers.push(pick(stopover, ['type', 'stop', 'arrival', 'arrivalPlatform', 'departure', 'departurePlatform']))
	}
	return stopovers
}

const createTrip = (t, id, trainNumber, date) => ({
	id,
	line: {
		type: 'line',
		id: trainNumber + '',
		name: trainNumber + '',
		product: get(t, 'serviceCode.designation'),
		productCode: get(t, 'serviceCode.code'),
		mode: 'train', // @todo
		public: true,
		operator
	},
	stopovers: createStopovers(t.trainStops, date)
})

const trip = async id => {
	if (!isString(id)) throw new Error('invalid `id` parameter: must be a valid trip id')
	const { trainNumber, formattedDate } = splitTripId(id)
	if (!trainNumber || !formattedDate) throw new Error('invalid `id` parameter: must be a valid trip id')
	const date = momentTz.tz(formattedDate, 'YYYY-MM-DD', 'Europe/Lisbon') // @todo
	const response = await getRequest(`https://api.cp.pt/cp-api/siv/trains/${trainNumber}/timetable/${formattedDate}`)
	return createTrip(response, id, trainNumber, date)
}

module.exports = trip
