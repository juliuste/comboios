'use strict'

const get = require('./fetch').get
const isNumber = require('lodash/isNumber')
const isDate = require('lodash/isDate')
const retry = require('p-retry')
const moment = require('moment')
require('moment-duration-format')
const momentTz = require('moment-timezone') // cheap hack for moment-duration-format fail

const transformStops = (s, date) => {
    const stops = []
    let lastTime = 0
    for(let stop of s){
        const station = {
            type: 'station',
            id: stop.station.code,
            name: stop.station.designation,
            platform: stop.platform
        }

        // format times
        const arrivalTime = +moment.duration(stop.arrival)
        if(arrivalTime < lastTime) date.add(1, 'days')
        station.arrival = moment.tz(date.format('DD.MM.YYYY')+' '+stop.arrival, 'DD.MM.YYYY HH:mm', 'Europe/Lisbon').toDate()
        lastTime = arrivalTime
        const departureTime = +moment.duration(stop.departure)
        if(departureTime < lastTime) date.add(1, 'days')
        station.departure = moment.tz(date.format('DD.MM.YYYY')+' '+stop.departure, 'DD.MM.YYYY HH:mm', 'Europe/Lisbon').toDate()
        lastTime = departureTime

        stops.push(station)
    }
    return stops
}

const createTrain = (date) => (t) => ({
    trainNumber: t.trainNumber,
    service: {
        name: t.serviceCode.designation,
        code: t.serviceCode.code
    },
    stops: transformStops(t.trainStops, date)
})

const trains = (trainNumber, date = new Date()) => {
    if(!isNumber(trainNumber)){
        throw new Error('invalid `trainNumber` parameter: must be a valid station cod')
    }
    if(!isDate(date)){
        throw new Error('invalid `date` parameter')
    }
    date = momentTz.tz(date, 'Europe/Lisbon')
    const formattedDate = date.format('YYYY-MM-DD')
    return get(`https://api.cp.pt/cp-api/siv/trains/${trainNumber}/timetable/${formattedDate}`)
    .then(createTrain(date))
}

module.exports = (trainNumber, date = new Date()) => retry(() => trains(trainNumber, date), {retries: 3})
