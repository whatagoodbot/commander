import { configDb } from './models/index.js'

import commands from './commandHandlers/index.js'
const botConfig = await configDb.get('whatAGoodBot')

const getCommands = () => { return Object.keys(commands) }

const processArguments = (message, separatorPosition) => {
  let args
  if (separatorPosition > 0) {
    args = message?.substring(separatorPosition + 1)
  }
  if (args) args = args.split(' ')
  return args
}

const processCommand = (command, args, options, repeaters) => {
  return commands[command]({ args, ...options }, repeaters)
}

export const searchForCommand = (options, repeaters) => {
  if (botConfig.commandIdentifiers.includes(options.message?.substring(0, 1))) {
    const separatorPosition = options.message.indexOf(' ') > 0 ? options.message.indexOf(' ') : options.message.length
    options.command = options.message?.substring(1, separatorPosition).toLowerCase()
    options.commandList = getCommands()
    if (options.commandList.includes(options.command)) {
      const commandActions = processCommand(options.command, processArguments(options.message, separatorPosition), options, repeaters)
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
