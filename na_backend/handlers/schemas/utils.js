const _ = require(`lodash`)
const Ajv = require(`ajv`)

const ajv = new Ajv()

const customTypes = exports.ct = {
  string: {type: `string`},
  int: {type: `integer`}
}

exports.toAjvObject = (properties, exclude) => {
  const propNames = Object.keys(properties)
  const required = (Array.isArray(exclude)) ? _.without(propNames, exclude) : propNames

  return {type: `object`, properties, required}
}

exports.toAjvArray = (items, minLength) => {
  const schema = {type: `array`, items}
  if (minLength) schema.minLength = minLength
  return schema
}

exports.compile = (schema) => ajv.compile(schema)