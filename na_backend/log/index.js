const log4js = require('log4js')

const loggers = {
  main: log4js.getLogger(`main`),
  db: log4js.getLogger(`db`),
  handlers: log4js.getLogger(`handlers`),
  processors: log4js.getLogger(`processors`),
  schemas: log4js.getLogger(`schemas`),
  utils: log4js.getLogger(`utils`)
}
for (let loggerName in loggers) {
  loggers[loggerName].level = `trace`;
}

module.exports = loggers
