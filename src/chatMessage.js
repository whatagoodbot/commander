// import { responsesDb, stringsDb, configDb } from '../../responder/src/models/index.js'
import { configDb } from '../../responder/src/models/index.js'
// import { metrics } from '../../responder/src/utils/metrics.js'
import { commands } from './commandHandlers/index.js'

const botConfig = await configDb.get('bot')

export default async (payload) => {
  // Validate message before doing anything
  if (botConfig.commandIdentifiers.includes(payload.message.substring(0, 1))) {
    const separatorPosition = payload.message.indexOf(' ') > 0 ? payload.message.indexOf(' ') : payload.message.length
    const command = payload.message?.substring(1, separatorPosition)
    if (commands.includes(command)) {
      let argument
      if (separatorPosition > 0) {
        argument = payload.message?.substring(separatorPosition + 1)
      }
      if (argument) argument = argument.split(' ')
    } else {
      // Must be an alias or unknown
    }
  } else {
    // Not a command, let's check if we want to do something based on some keywords
    // const lowerCaseMessage = payload.message.toLowerCase()
  }

  // Check for command identifier
  // Check for known commands
  // Check for a response
  // None of the above - reply I don't understand

  // Also check for sentiant keywords
  // Can we have a timer to know that the next message is a continuation of the conversation

  // ----------------------------------------------------------------------------------------------------
  // metrics.count('chatMessage', { room: payload.room, key: payload.key })
  // const chosenResponse = pickResponse(await responsesDb.get(payload.room, payload.key))
  // if (!chosenResponse?.value) return { message: await stringsDb.get('noComprende') }
  // return {
  //   [typeMapping[chosenResponse.type]]: chosenResponse.value
  // }
}
