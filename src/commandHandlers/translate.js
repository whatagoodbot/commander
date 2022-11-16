import { buildUrl, makeRequest } from '../utils/networking.js'

export default async (options) => {
  let q = options.lastMessage
  const target = 'en'
  if (options.args) {
    console.log(options.args)
    q = options.args.join(' ') || options.lastMessage
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
