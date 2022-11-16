import { buildUrl, makeRequest } from '../utils/networking.js'

export default async (options) => {
  let q = options.lastMessage
  let target = 'en'
  if (options.args.length > 1) {
    target = options.args.shift().toLowerCase()
    q = options.args.join(' ') || options.lastMessage
  } else {
    return [{
      topic: 'responseRead',
      payload: {
        category: 'system',
        key: 'translateToError'
      }
    }]
  }

  const query = {
    q,
    source: 'auto',
    target
  }
  const url = buildUrl(process.env.TRANSLATE_URL, ['translate'], null, 'http')
  const response = await makeRequest(url, { method: 'POST', body: JSON.stringify(query) })
  return [{
    topic: 'broadcast',
    payload: {
      message: `"${q}" in ${target} is "${response.translatedText}"`
    }
  }]
}
