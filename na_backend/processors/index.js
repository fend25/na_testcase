const log = require(`../log`).handlers

const dbModule = require('../db')
const sqlite = dbModule.sqlite
const knex = dbModule.knex

const getAgentList = exports.getAgentList = async () => {
  const query = knex(`order`).distinct(`agent`)

  const agents = await sqlite.all(query.toString())

  return agents.map(({agent}) => agent)
}

const getAgentsStats = exports.getAgentStats = async (agentName) => {
  const query = knex(`order`)
    .select(`agent`)
    .count(`* as count`)
    .sum(`amount as amount`)
    .groupBy(`agent`)
    .orderBy(`amount`, `desc`)
  if (agentName) query.where(`agent`, `=`, agentName)

  const agents = await sqlite.all(query.toString())

  return agents
}

const getAllOrders = exports.getAllOrders = async () => {
  const query = knex(`order`).select(`*`)
  const orders = await sqlite.all(query.toString())

  return orders
}

const getOrder = exports.getOrder = async (orderId) => {
  const query = knex(`order`).select(`*`).where(`orderId`, `=`, orderId)
  const order = await sqlite.get(query.toString())

  return order
}

const deleteOrder = exports.deleteOrder = async (orderId) => {
  const order = await getOrder(orderId)
  if (!order) return {found: false, orderId}

  const query = knex(`order`).delete().where(`orderId`, `=`, orderId)
  await sqlite.run(query.toString())

  return {found: true, orderId}
}

const addOrders = exports.addOrders = async(orders) => {
  const query = knex(`order`).insert(orders)
  await sqlite.run(query.toString())
}