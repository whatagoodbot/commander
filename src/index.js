import broker from 'message-broker'

import { logger } from './utils/logging.js'
import { metrics } from './utils/metrics.js'
import { performance } from 'perf_hooks'
import songPlayed from './commandHandlers/songPlayed.js'
import { searchForCommand } from './commands.js'

const repeaters = {}
const topicPrefix = `${process.env.NODE_ENV}/`

const subscribe = () => {
  const topics = ['chatMessage', 'songPlayed']
  topics.forEach(topic => {
    broker.client.subscribe(`${topicPrefix}${topic}`, (err) => {
      logger.info(`subscribed to ${topicPrefix}${topic}`)
      if (err) {
        logger.error({
          error: err.toString(),
          topic
        })
      }
    })
  })
}

if (broker.client.connected) {
  subscribe()
} else {
  broker.client.on('connect', subscribe)
}

broker.client.on('error', (err) => {
  logger.error({
    error: err.toString()
  })
})

broker.client.on('message', async (topic, data) => {
  const startTime = performance.now()
  const topicName = topic.substring(topicPrefix.length)
  metrics.count('receivedMessage', { topicName })
  let requestPayload
  try {
    requestPayload = JSON.parse(data.toString())
    const validatedRequest = broker[topicName].validate(requestPayload)
    if (validatedRequest.errors) throw { message: validatedRequest.errors } // eslint-disable-line
    if (topicName === 'songPlayed') {
      songPlayed(validatedRequest, repeaters)
    } else {
      const processedResponse = await searchForCommand(validatedRequest, repeaters)
      if (!processedResponse) return
      const validatedResponse = broker[processedResponse.topic].validate({
        ...validatedRequest,
        ...processedResponse.payload
      })
      if (validatedResponse.errors) throw { message: validatedResponse.errors } // eslint-disable-line
      logger.debug(`Publising ${topicPrefix}${processedResponse.topic}`)
      broker.client.publish(`${topicPrefix}${processedResponse.topic}`, JSON.stringify(validatedResponse))
    }

    metrics.timer('responseTime', performance.now() - startTime, { topic })
  } catch (error) {
    logger.error(error.message)
    logger.debug(requestPayload)
    requestPayload = requestPayload || {
      messageId: 'ORPHANED'
    }
    const validatedResponse = broker.responseRead.validate({
      key: 'somethingWentWrong',
      category: 'system',
      ...requestPayload
    })
    metrics.count('error', { topicName })
    broker.client.publish(`${topicPrefix}responseRead`, JSON.stringify(validatedResponse))
  }
})
