'use strict'

const got = require('got')
const retry = require('p-retry')
const stringify = require('querystring').stringify

let token

const getNewToken = () =>
	got.post('https://api.cp.pt/cp-api/oauth/token', {
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Basic Y3AtbW9iaWxlOnBhc3M=', // Base64 of "cp-mobile:pass"
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: stringify({
			grant_type: 'client_credentials'
		})
	})
		.then((res) => JSON.parse(res.body))
		.then((res) => res.access_token)

const savedToken = () => token ? Promise.resolve(token) : renewSavedToken()

const renewSavedToken = () =>
	getNewToken()
		.then((res) => {
			token = res
			return res
		})

const getRequest = (url, params = {}) => async (token) => {
	const res = await got.get(url, {
		json: true,
		query: params,
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${token}`
		}
	})
	return res.body
}

const get = (url, params) =>
	retry(() => savedToken()
		.then(getRequest(url, params))
		// eslint-disable-next-line handle-callback-err
		.catch((error) => renewSavedToken), // todo: handling non-token-specific errors
	{ retries: 3 }
	)

const postRequest = (url, body = {}) => async (token) => {
	const res = await got.post(url, {
		body: JSON.stringify(body),
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	})
	return JSON.parse(res.body)
}

const post = (url, body) =>
	retry(() => savedToken()
		.then(postRequest(url, body))
		// eslint-disable-next-line handle-callback-err
		.catch((error) => renewSavedToken), // todo: handling non-token-specific errors
	{ retries: 3 }
	)

module.exports = {
	get,
	post
}
