import { logger, metrics } from '@whatagoodbot/utilities'
import { getExternalCommandList, processExternalCommand } from './commandHandlers/externallyProcessed.js'

import alias from './commandHandlers/alias.js'
import aliases from './commandHandlers/aliases.js'
import deletealias from './commandHandlers/deleteAlias.js'
import dice from './commandHandlers/dice.js'
import help from './commandHandlers/help.js'
import incrementingResponse from './commandHandlers/incrementingResponse.js'
import lastfm from './commandHandlers/lastfm.js'
import magic8ball from './commandHandlers/magic8ball.js'
import mock from './commandHandlers/mock.js'
import playlist from './commandHandlers/playlist.js'
import translate from './commandHandlers/translate.js'
import translateto from './commandHandlers/translateto.js'
import wut from './commandHandlers/wut.js'

const lastMessage = {}
const internalCommands = {
  alias,
  aliases,
  dice,
  deletealias,
  help,
  lastfm,
  magic8ball,
  mock,
  playlist,
  translate,
  translateto,
  wut
}

const getCommands = (commands) => { return Object.keys(commands) }

const processArguments = (message, separatorPosition) => {
  const functionName = 'processArguments'
  logger.debug({ event: functionName })
  metrics.count(functionName)
  let args
  if (separatorPosition > 0) {
    args = message?.substring(separatorPosition + 1)
  }
  if (args) args = args.split(' ')
  return args
}

const processCommand = (command, args, options, commandList = internalCommands) => {
  const functionName = 'processCommand'
  logger.debug({ event: functionName })
  metrics.count(functionName)
  return commandList[command]({ args, ...options })
}

export const searchForCommand = async (options, repeaters) => {
  if (options.room.botConfig.commandIdentifiers.includes(options.chatMessage?.substring(0, 1))) {
    const functionName = 'searchForCommand'
    logger.debug({ event: functionName })
    metrics.count(functionName)
    const separatorPosition = options.chatMessage.indexOf(' ') > 0 ? options.chatMessage.indexOf(' ') : options.chatMessage.length
    options.command = options.chatMessage?.substring(1, separatorPosition).toLowerCase()
    const externalCommands = await getExternalCommandList(options.room.id)
    options.internalCommandList = getCommands(internalCommands)
    options.externalCommandList = getCommands(externalCommands)
    if (options.internalCommandList.includes(options.command)) {
      options.lastMessage = lastMessage[options.room.id]
      return await processCommand(options.command, processArguments(options.chatMessage, separatorPosition), options)
    } else if (options.externalCommandList.includes(options.command) && externalCommands[options.command].topic === 'incrementingResponse') {
      const args = processArguments(options.chatMessage, separatorPosition)
      const commandActions = incrementingResponse({ args, ...options }, repeaters)
      if (commandActions) return commandActions
    } else if (options.externalCommandList.includes(options.command) && externalCommands[options.command].topic === 'internalRequest') {
      options.lastMessage = lastMessage[options.room.id]
      const commandActions = await processCommand(options.command, processArguments(options.chatMessage, separatorPosition), options)
      if (commandActions) return commandActions
    } else if (options.externalCommandList.includes(options.command)) {
      const commandActions = processExternalCommand(externalCommands[options.command], processArguments(options.chatMessage, separatorPosition))
      if (commandActions) return commandActions
    } else {
      const payload = {
        key: options.command,
        room: options.room,
        category: 'general'
      }
      const functionName = 'alias'
      logger.debug({ event: functionName, key: payload.key })
      metrics.count(functionName)

      return [{
        topic: 'responseRead',
        payload
      }]
    }
  } else {
    lastMessage[options.room.id] = options.chatMessage
    return [{
      topic: 'forwardedChatMessage',
      payload: options
    }]
  }
}
