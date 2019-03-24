'use strict'

const operator = {
	type: 'operator',
	id: 'cp',
	name: 'Comboios de Portugal',
	url: 'https://www.cp.pt/'
}

const createStation = s => ({
	type: 'station',
	id: s.code,
	name: s.designation
})

const buildTripId = (trainNumber, formattedDate) => [trainNumber, formattedDate].join('@')
const splitTripId = (tripId) => {
	const [trainNumber, formattedDate] = tripId.split('@')
	return { trainNumber, formattedDate }
}

module.exports = { operator, createStation, buildTripId, splitTripId }
