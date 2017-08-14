const log = require(`../log`).handlers

const processors = require(`../processors`)
const validators = require(`./schemas`)

exports.getAgentList = async (req, res, next) => {
  const agents = await processors.getAgentList()

  return {agents}
}

exports.getAllAgentStats = async (req, res, next) => {
  const agents = await processors.getAgentStats()

  return {agents}
}

exports.getAgentStats = async (req, res, next) => {
  const agentName = req.params.id
  const agents = await processors.getAgentStats(agentName)

  if (agents.length) return {agent: agents[0]}
  else throw new Error(`agent ${agentName} has not been found`)
}

exports.getAllOrders = async (req, res, next) => {
  const orders = await processors.getAllOrders()

  return {orders}
}

exports.getOrder = async (req, res, next) => {
  const orderId = req.params.id
  const order = await processors.getOrder(orderId)

  if (order) return {order}
  else return {ok: false, error: `order with id ${orderId} has not been found`}
}

exports.deleteOrder = async (req, res, next) => {
  const orderId = req.params.id
  const result = await processors.deleteOrder(orderId)

  if (result.found) return {orderId}
  else return {ok: false, error: `order with id ${orderId} has not been found`}
}

exports.uploadOrdersJson = async (req, res, next) => {
  if (!req.file || !req.file.buffer) throw new Error(`no file has been uploaded`)

  const orders = JSON.parse(req.file.buffer.toString())

  const validator = validators.ordersJsonValidator
  const valid = validator(orders)
  if (!valid) {
    log.trace(validator.errors)
    throw new Error(`JSON is not valid. \n${JSON.stringify(validator.errors, null, 2)}`)
  }

  await processors.addOrders(orders)

  return {uploaded: orders.length}
}
