'use strict'

const post = require('./fetch').post
const isString = require('lodash.isstring')
const isDate = require('lodash.isdate')
const sortBy = require('lodash.sortby')
const moment = require('moment')
require('moment-duration-format')
const momentTz = require('moment-timezone') // cheap hack for moment-duration-format fail

const clone = (x) => JSON.parse(JSON.stringify(x))

const createPrice = (j) => (p) => ({
    class: +p.travelClass,
    amount: +p.centsValue / 100,
    currency: 'EUR',
    fareType: p.priceType,
    saleURL: (j.saleLink && j.saleLink.code) ? j.saleLink.code : null // todo: saleableOnline
})

const createStation = (s) => ({
    type: 'station',
    id: s.code,
    name: s.designation
})

const hashLeg = (date) => (s) => date+'@'+s.departureStation.code+'@'+s.departureTime+'@'+s.arrivalStation.code+'@'+s.arrivalTime+'@'+s.trainNumber+'@'+s.duration
const hashJourney = (sections, date) => sections.map(hashLeg(date)).join('-')

const createJourney = (date) => (j) => {
    const journey = {
        type: 'journey'
    }

    // legs
    let lastTime = 0
    const legs = []
    const sections = sortBy(j.travelSections, (x) => x.sequenceNumber)
    for(let section of sections){
        const leg = {
            origin: createStation(section.departureStation),
            destination: createStation(section.arrivalStation),
            departurePlatform: section.departurePlatform,
            arrivalPlatform: section.arrivalPlatform,
            trainNumber: section.trainNumber,
            service: section.serviceCode ? {
                name: section.serviceCode.designation,
                code: section.serviceCode.code
            } : null,
            mode: 'train', // todo
            public: true,
            operator: {
                type: 'operator',
                id: 'cp',
                name: 'Comboios de Portugal',
                url: 'https://www.cp.pt/'
            }
        }

        // arrival time
        const arrivalTime = +moment.duration(section.arrivalTime)
        if(arrivalTime < lastTime) date.add(1, 'days')
        leg.arrival = moment.tz(date.format('DD.MM.YYYY')+' '+section.arrivalTime, 'DD.MM.YYYY HH:mm', 'Europe/Lisbon').toDate()
        lastTime = arrivalTime

        const stops = []
        for(let s of section.trainStops){
            const station = {
                type: 'station',
                id: s.station.code,
                name: s.station.designation,
                platform: s.platform
            }

            const arrivalTime = +moment.duration(s.arrival)
            if(arrivalTime < lastTime) date.add(1, 'days')
            station.arrival = moment.tz(date.format('DD.MM.YYYY')+' '+s.arrival, 'DD.MM.YYYY HH:mm', 'Europe/Lisbon').toDate()
            lastTime = arrivalTime
            const departureTime = +moment.duration(s.departure)
            if(departureTime < lastTime) date.add(1, 'days')
            station.departure = moment.tz(date.format('DD.MM.YYYY')+' '+s.departure, 'DD.MM.YYYY HH:mm', 'Europe/Lisbon').toDate()
            lastTime = departureTime

            stops.push(station)
        }

        // departure time
        const departureTime = +moment.duration(section.departureTime)
        if(departureTime < lastTime) date.add(1, 'days')
        leg.departure = moment.tz(date.format('DD.MM.YYYY')+' '+section.departureTime, 'DD.MM.YYYY HH:mm', 'Europe/Lisbon').toDate()
        lastTime = departureTime

        leg.stops = stops

        legs.push(leg)
    }

    // id
    journey.id = hashJourney(sections, date.format("DD.MM.YYYY"))

    journey.legs = legs

    // prices
    let prices = j.basePrices.map(createPrice(j))
    prices = sortBy(prices.filter((x) => x.amount > 0), (x) => x.amount)
    if(prices.length > 0){
        const lowestPrice = clone(prices[0])
        journey.price = lowestPrice

        if(prices.length > 1){
            journey.price.fares = clone(prices)
        }
    }

    return journey
}

const journeys = (origin, destination, date = new Date()) => {
    if(isString(origin)) origin = {id: origin, type: 'station'}
    if(!isString(origin.id)) throw new Error('invalid or missing origin id')
    if(origin.type !== 'station') throw new Error('invalid or missing origin type')
    origin = origin.id

    if(isString(destination)) destination = {id: destination, type: 'station'}
    if(!isString(destination.id)) throw new Error('invalid or missing destination id')
    if(destination.type !== 'station') throw new Error('invalid or missing destination type')
    destination = destination.id

    if(!isDate(date)){
        throw new Error('invalid `date` parameter')
    }
    date = momentTz.tz(date, 'Europe/Lisbon')
    const formattedDate = date.format('YYYY-MM-DD')

    return post("https://api.cp.pt/cp-api/siv/travel/search", {
        departureStationCode: origin,
        arrivalStationCode: destination,
        classes: [1,2], // todo
        searchType: 3,
        travelDate: formattedDate,
        returnDate: null, // todo
        timeLimit: null
    })
    .then((res) => res.outwardTrip.map(createJourney(date))) // todo: check if date = res.travelDate
}

module.exports = journeys
