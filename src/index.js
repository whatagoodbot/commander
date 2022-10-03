import broker from 'message-broker'

import { logger } from './utils/logging.js'
import { metrics } from './utils/metrics.js'
import { searchForCommand } from './commandHandlers/index.js'

export const topicPrefix = `${process.env.NODE_ENV}/`

const topics = {
  chatMessage: {}
}

const subscribe = () => {
  Object.keys(topics).forEach((topic) => {
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

const reshapeMeta = (requestPayload) => {
  const sentMeta = requestPayload?.meta
  delete requestPayload?.meta
  return { ...requestPayload, ...sentMeta }
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
  const topicName = topic.substring(topicPrefix.length)
  let requestPayload
  try {
    metrics.count('receivedMessage', { topicName })
    requestPayload = JSON.parse(data.toString())

    const validatedRequest = broker[topicName].validate(requestPayload)
    if (validatedRequest.errors) throw { message: validatedRequest.errors } // eslint-disable-line

    if (validatedRequest.message && validatedRequest.message.length > 1) {
      searchForCommand({
        message: validatedRequest.message,
        room,
        sender,
        topicPrefix,
        client: broker.client,
        meta: reshapeMeta(requestPayload)
      })
    }
  } catch (error) {
    const validatedResponse = broker.systemError.validate({
      payload: {
        errors: error.message,
        message: 'Uh oh'
      },
      meta: reshapeMeta(requestPayload)
    })
    metrics.count('error', { topicName })
    broker.client.publish(topics[topicName].replyTopic, JSON.stringify(validatedResponse))
  }
})
