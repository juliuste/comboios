'use strict'

const get = require('./fetch').get
const isString = require('lodash.isstring')
const isDate = require('lodash.isdate')
const retry = require('p-retry')
const moment = require('moment')
require('moment-duration-format')
const momentTz = require('moment-timezone') // cheap hack for moment-duration-format fail

const createStation = (s) => ({
    type: 'station',
    id: s.code,
    name: s.designation
})

const transformDepartures = (d, date) => {
    const departures = []
    let lastTime = 0
    for(let dep of d){
        const departure = {
            type: 'departure',
            trainNumber: dep.trainNumber,
            service: dep.trainService ? {
                name: dep.trainService.designation,
                code: dep.trainService.code
            } : null,
            origin: dep.trainOrigin ? createStation(dep.trainOrigin) : null,
            destination: dep.trainDestination ? createStation(dep.trainDestination) : null,
            platform: dep.platform
        }

        // format times
        if(dep.arrivalTime){
            const arrivalTime = +moment.duration(dep.arrivalTime)
            if(arrivalTime < lastTime) date.add(1, 'days')
            departure.arrival = moment.tz(date.format('DD.MM.YYYY')+' '+dep.arrivalTime, 'DD.MM.YYYY HH:mm', 'Europe/Lisbon').toDate()
            lastTime = arrivalTime
        }
        if(dep.departureTime){
            const departureTime = +moment.duration(dep.departureTime)
            if(departureTime < lastTime) date.add(1, 'days')
            departure.departure = moment.tz(date.format('DD.MM.YYYY')+' '+dep.departureTime, 'DD.MM.YYYY HH:mm', 'Europe/Lisbon').toDate()
            lastTime = departureTime
        }

        if(!departure.arrival && departure.departure){
            departure.arrival = new Date(departure.departure)
        }
        else if(departure.arrival && !departure.departure){
            departure.departure = new Date(departure.arrival)
        }
        else if(!departure.arrival && !departure.departure){
            throw new Error('departure must have either departure or arrival time')
        }

        departures.push(departure)
    }
    return departures
}

const departures = (station, date = new Date()) => {
    if(isString(station)) station = {id: station, type: 'station'}
    if(!isString(station.id)) throw new Error('invalid or missing station id')
    if(station.type !== 'station') throw new Error('invalid or missing station type')
    station = station.id

    if(!isDate(date)){
        throw new Error('invalid `date` parameter')
    }

    date = momentTz.tz(date, 'Europe/Lisbon')
    const formattedDate = date.format('YYYY-MM-DD')
    return get(`https://api.cp.pt/cp-api/siv/stations/${station}/timetable/${formattedDate}`)
    .then((res) => transformDepartures(res.stationStops, date))
}

module.exports = (station, date = new Date()) => retry(() => departures(station, date), {retries: 3})
