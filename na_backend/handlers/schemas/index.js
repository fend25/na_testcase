const utils = require(`./utils`)
const ct = utils.ct
const compile = utils.compile
const toAjvObject = utils.toAjvObject
const toAjvArray = utils.toAjvArray

const ordersJsonSchema = toAjvArray(toAjvObject({
  orderId: ct.string,
  departureDate: ct.string,
  city1: ct.string,
  city2: ct.string,
  agent: ct.string,
  amount: ct.int
}))
exports.ordersJsonValidator = compile(ordersJsonSchema)
