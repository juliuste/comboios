'use strict'

const { get: getRequest } = require('./fetch')

const createStation = (s) => ({
	type: 'station',
	id: s.code,
	name: s.designation,
	location: !(s.latitude && s.longitude) ? undefined : {
		type: 'location',
		longitude: +s.longitude,
		latitude: +s.latitude
	}
})

const stations = () =>
	getRequest('https://api.cp.pt/cp-api/siv/stations/')
		.then((res) => res.map(createStation))

module.exports = stations
