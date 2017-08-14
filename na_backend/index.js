const log = require(`./log`).main

const dbModule = require(`./db`)
const sqlite = dbModule.sqlite

const Promise = require(`bluebird`)

const express = require(`express`)
const upload = require(`multer`)()
const cors = require(`cors`)

const fs = require(`mz`).fs

const _ = require(`lodash`)
const handlers = require(`./handlers`)
const processors = require(`./processors`)
const utils = require(`./utils`)
const wrap = utils.wrap

const app = express()
const port = process.env.PORT || 3001

app.use(cors())

app.get(`/agentList`, wrap(handlers.getAgentList))
app.get(`/agentStat/:id`, wrap(handlers.getAgentStats))
app.get(`/agentStats`, wrap(handlers.getAllAgentStats))

app.get(`/order/:id`, wrap(handlers.getOrder))
app.get(`/orders`, wrap(handlers.getAllOrders))
app.delete(`/order/:id`, wrap(handlers.deleteOrder))

app.post(`/ordersJson`, upload.single(`orders`), wrap(handlers.uploadOrdersJson))

// application entry point
async function start() {
  try {
    //delete, create db and fill it wth seed data
    await fs.unlink(dbModule.DB_FILE).catch(() => {})

    await sqlite.open(dbModule.DB_FILE, {Promise})
    await sqlite.run(dbModule.schemaQuery)

    const orders = await utils.readSeedData(`./input.txt`)
    await processors.addOrders(orders)
    log.info(`seed data has been successfully added to the db`)

    //start server
    app.listen(port)
    log.info(`server is listening on port ${port}`)
  } catch (err) {
    log.error((_.isObject(err) && err.stack) ? err.stack : err)
  }
}

Promise.resolve(start()) //start returns nothing and never throws an error outside