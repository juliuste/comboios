'use strict'

const got = require('got')
const retry = require('p-retry')
const stringify = require('querystring').stringify

let token

const getNewToken = async () => {
	const { body } = await got.post('https://api.cp.pt/cp-api/oauth/token', {
		headers: {
			Authorization: 'Basic Y3AtbW9iaWxlOnBhc3M=', // Base64 of "cp-mobile:pass"
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: stringify({
			grant_type: 'client_credentials',
		}),
		responseType: 'json',
	})
	return body.access_token
}

const savedToken = () => token ? Promise.resolve(token) : renewSavedToken()

const renewSavedToken = () =>
	getNewToken()
		.then((res) => {
			token = res
			return res
		})

const getRequest = (url, params = {}) => async (token) => {
	const { body } = await got.get(url, {
		searchParams: stringify(params),
		headers: {
			Authorization: `Bearer ${token}`,
		},
		responseType: 'json',
	})
	return body
}

const postRequest = (url, body = {}) => async (token) => {
	const { body: responseBody } = await got.post(url, {
		json: body,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		responseType: 'json',
	})
	return responseBody
}

const requestWithRetry = request => retry(
	() => savedToken().then(request).catch(error => {
		renewSavedToken()
		throw error
	}),
	{ retries: 1 },
)

const get = (url, params) => requestWithRetry(getRequest(url, params))
const post = (url, body) => requestWithRetry(postRequest(url, body))

module.exports = {
	get,
	post,
}
