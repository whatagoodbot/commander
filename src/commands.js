import { configDb } from './models/index.js'

import alias from './commandHandlers/alias.js'
import aliases from './commandHandlers/aliases.js'
import help from './commandHandlers/help.js'
import addgreeting from './commandHandlers/addGreeting.js'
import incrementingResponse from './commandHandlers/incrementingResponse.js'
import { getExternalCommandList, processExternalCommand } from './commandHandlers/externallyProcessed.js'

const internalCommands = {
  addgreeting,
  alias,
  aliases,
  help
}

const getCommands = (commands) => { return Object.keys(commands) }

const processArguments = (message, separatorPosition) => {
  let args
  if (separatorPosition > 0) {
    args = message?.substring(separatorPosition + 1)
  }
  if (args) args = args.split(' ')
  return args
}

const processCommand = (command, args, options, repeaters) => {
  return internalCommands[command]({ args, ...options }, repeaters)
}

export const searchForCommand = async (options, repeaters) => {
  const botConfig = await configDb.get(options.room)
  if (botConfig.commandIdentifiers.includes(options.message?.substring(0, 1))) {
    const separatorPosition = options.message.indexOf(' ') > 0 ? options.message.indexOf(' ') : options.message.length
    options.command = options.message?.substring(1, separatorPosition).toLowerCase()
    const externalCommands = await getExternalCommandList()
    options.internalCommandList = getCommands(internalCommands)
    options.externalCommandList = getCommands(externalCommands)
    if (options.internalCommandList.includes(options.command)) {
      const commandActions = processCommand(options.command, processArguments(options.message, separatorPosition), options)
      if (commandActions) {
        return {
          topic: commandActions.topic,
          payload: commandActions.payload
        }
      }
    } else if (options.externalCommandList.includes(options.command) && externalCommands[options.command].topic === 'incrementingResponse') {
      const args = processArguments(options.message, separatorPosition)
      const commandActions = incrementingResponse({ args, ...options }, repeaters)
      if (commandActions) {
        return {
          topic: commandActions.topic,
          payload: commandActions.payload
        }
      }
    } else if (options.externalCommandList.includes(options.command)) {
      const commandActions = processExternalCommand(externalCommands[options.command], processArguments(options.message, separatorPosition))
      if (commandActions) {
        return {
          topic: commandActions.topic,
          payload: commandActions.payload
        }
      }
    } else {
      return {
        topic: 'responseRead',
        payload: {
          key: options.command,
          room: options.room,
          category: 'general'
        }
      }
    }
  } else {
    return {
      topic: 'forwardedChatMessage',
      payload: options
    }
  }
}
