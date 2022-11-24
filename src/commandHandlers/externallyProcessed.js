import { clients } from '@whatagoodbot/rpc'
import { logger, metrics } from '@whatagoodbot/utilities'

export const processExternalCommand = (command, args) => {
  const functionName = 'processExternalCommand'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const response = command
  if (args) response.payload.arguments = args?.join(' ')
  return [response]
}

export const getExternalCommandList = async (room) => {
  const functionName = 'getExternalCommandList'
  logger.debug({ event: functionName })
  metrics.count(functionName)

  const commandList = {}
  const availableCommands = await clients.commands.get(room)
  availableCommands.commands.forEach(availableCommand => {
    commandList[availableCommand.command] = {
      topic: availableCommand.topic,
      payload: {
        command: availableCommand.command,
        service: availableCommand.service,
        arguments: undefined
      }
    }
  })
  return commandList
}
