'use strict'

const get = require('./fetch').get

const createStation = (s) => ({
    type: 'station',
    id: s.code,
    name: s.designation,
    coordinates: !(s.latitude && s.longitude) ? null : {
        longitude: +s.longitude,
        latitude: +s.latitude
    }
})

const stations = () =>
    get("https://api.cp.pt/cp-api/siv/stations/")
    .then((res) => res.map(createStation))

module.exports = stations
