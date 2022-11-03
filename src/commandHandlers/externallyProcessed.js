import { commandsDb } from '../models/index.js'

export const processExternalCommand = (command, args) => {
  const response = command
  if (args) response.payload.arguments = args?.join(' ')
  return response
}

export const getExternalCommandList = async (room) => {
  const commandList = {}
  const availableCommands = await commandsDb.get(room)
  availableCommands.forEach(availableCommand => {
    commandList[availableCommand.name] = {
      topic: availableCommand.topic,
      payload: {
        name: availableCommand.name,
        service: availableCommand.service,
        arguments: undefined
      }
    }
  })
  return commandList
}
