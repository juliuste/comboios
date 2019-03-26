'use strict'

const { toUIC } = require('uic-codes')
const zerofill = require('zero-fill')

const operator = {
	type: 'operator',
	id: 'cp',
	name: 'Comboios de Portugal',
	url: 'https://www.cp.pt/'
}

const uicCodeFromId = id => zerofill(2, +(id.split('-')[0]))
const idToUicId = id => {
	const [country, station] = id.split('-')
	return [zerofill(2, +country), zerofill(5, +station)].join('')
}

// @todo
const timezoneAndCountry = uicCode => {
	if (+uicCode === toUIC.PRT) return { timezone: 'Europe/Lisbon', country: 'PT' }
	if (+uicCode === toUIC.ESP) return { timezone: 'Europe/Madrid', country: 'ES' }
	if (+uicCode === toUIC.FRA) return { timezone: 'Europe/Paris', country: 'FR' }
	throw new Error(`Unexpected uic code: ${uicCode}`)
}

const createStation = s => ({
	type: 'station',
	id: s.code,
	uicId: idToUicId(s.code),
	name: s.designation,
	...timezoneAndCountry(uicCodeFromId(s.code))
})

const buildTripId = (trainNumber, formattedDate) => [trainNumber, formattedDate].join('@')
const splitTripId = (tripId) => {
	const [trainNumber, formattedDate] = tripId.split('@')
	return { trainNumber, formattedDate }
}

module.exports = { operator, createStation, buildTripId, splitTripId, uicCodeFromId, idToUicId, timezoneAndCountry }
