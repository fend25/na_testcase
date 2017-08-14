const log = require(`../log`).utils

const fs = require(`mz`).fs

exports.readSeedData = async function readSeedData(fileName) {
  const file = (await fs.readFile(fileName)).toString()
  return file
    .split(`\n`)
    .map(line => {
      const [orderId, departureDate, city1, city2, agent, amount] = line.split(`, `)
      return {orderId, departureDate, city1, city2, agent, amount}
    })
}

exports.wrap = (fn) => async function (req, res, next) {
  try {
    const result = await fn(req, res, next)
    if (typeof result === `object` && result.ok === false) res.send(result)
    else res.send({ok: true, result})
  } catch (err) {
    if (typeof err === `object` && err.message) res.send({ok: false, error: err.message})
    else if (typeof err === `string`) res.send({ok: false, error: err})
    else res.send({ok: false, error: `internal server error`})

    log.error(err)
  }
}
