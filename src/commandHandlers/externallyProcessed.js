import { commandsDb } from '../models/index.js'

export const processExternalCommand = (command, args) => {
  const response = command
  if (args) response.payload.arguments = args?.join(' ')
  return response
}

export const getExternalCommandList = async () => {
  const commandList = {}
  const availableCommands = await commandsDb.get()
  availableCommands.forEach(availableCommand => {
    commandList[availableCommand.name] = {
      topic: availableCommand.topic,
      payload: {
        name: availableCommand.name,
        service: availableCommand.service,
        arguments: {}
      }
    }
  })
  return commandList
}
