import alias from './commandHandlers/alias.js'
import aliases from './commandHandlers/aliases.js'
import help from './commandHandlers/help.js'
import addusergreeting from './commandHandlers/addUserGreeting.js'
import addroomgreeting from './commandHandlers/addRoomGreeting.js'
import incrementingResponse from './commandHandlers/incrementingResponse.js'
import mock from './commandHandlers/mock.js'
import wut from './commandHandlers/wut.js'
import slots from './commandHandlers/slots.js'
import translate from './commandHandlers/translate.js'
import translateto from './commandHandlers/translateto.js'
import { getExternalCommandList, processExternalCommand } from './commandHandlers/externallyProcessed.js'

const lastMessage = {}
const internalCommands = {
  addusergreeting,
  addroomgreeting,
  alias,
  aliases,
  help,
  mock,
  translate,
  translateto,
  wut
}
const hiddenCommands = {
  slots
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

const processCommand = (command, args, options, commandList = internalCommands) => {
  return commandList[command]({ args, ...options })
}

export const searchForCommand = async (options, repeaters) => {
  console.log(options.room)
  if (options.room.commandIdentifiers.includes(options.chatMessage?.substring(0, 1))) {
    const separatorPosition = options.chatMessage.indexOf(' ') > 0 ? options.chatMessage.indexOf(' ') : options.chatMessage.length
    options.command = options.chatMessage?.substring(1, separatorPosition).toLowerCase()
    const externalCommands = await getExternalCommandList(options.room.slug)
    options.internalCommandList = getCommands(internalCommands)
    options.externalCommandList = getCommands(externalCommands)
    if (options.internalCommandList.includes(options.command)) {
      options.lastMessage = lastMessage[options.room.slug]
      const commandActions = await processCommand(options.command, processArguments(options.chatMessage, separatorPosition), options)
      if (commandActions) {
        return {
          topic: commandActions.topic,
          payload: commandActions.payload
        }
      }
    } else if (options.externalCommandList.includes(options.command) && externalCommands[options.command].topic === 'incrementingResponse') {
      const args = processArguments(options.chatMessage, separatorPosition)
      const commandActions = incrementingResponse({ args, ...options }, repeaters)
      if (commandActions) {
        return {
          topic: commandActions.topic,
          payload: commandActions.payload
        }
      }
    } else if (options.externalCommandList.includes(options.command) && externalCommands[options.command].topic === 'internalRequest') {
      options.lastMessage = lastMessage[options.room.slug]
      const commandActions = await processCommand(options.command, processArguments(options.chatMessage, separatorPosition), options, hiddenCommands)
      if (commandActions) {
        return {
          topic: commandActions.topic,
          payload: commandActions.payload
        }
      }
    } else if (options.externalCommandList.includes(options.command)) {
      const commandActions = processExternalCommand(externalCommands[options.command], processArguments(options.chatMessage, separatorPosition))
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
    lastMessage[options.room.slug] = options.chatMessage
    return {
      topic: 'forwardedChatMessage',
      payload: options
    }
  }
}
