import { getExternalCommandList } from './externallyProcessed.js'

export default async (payload, repeaters) => {
  Object.keys(await getExternalCommandList()).forEach(command => {
    if (repeaters[payload.room.slug] && repeaters[payload.room.slug][command]) {
      repeaters[payload.room.slug][command].count = 0
      repeaters[payload.room.slug][command].users = []
    }
  })
}
