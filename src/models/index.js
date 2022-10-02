import { createRequire } from 'module'
import knexfile from '../../knexfile.js'

import configModel from './config.js'

const require = createRequire(import.meta.url)
const { knex } = require('../libs/knex.cjs')(knexfile[process.env.NODE_ENV])

export const configDb = configModel(knex)
