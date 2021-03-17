import { wrap } from 'underscore'
import { hostname } from 'os'
import StatsdClient from 'hot-shots'
import { loadCustomConfiguration } from '../config'

const statsdConfig = loadCustomConfiguration().statsdConfig

export const statsdClient = new StatsdClient({
    host: statsdConfig.host,
    cacheDns: true,
    telegraf: true,
    errorHandler: err => console.error(err.stack || err),
    prefix: `${statsdConfig.prefix}.${statsdConfig.env}.system.${hostname()}_`,
    globalTags: {}
})

if (statsdConfig.debug) {
    StatsdClient.prototype.sendMessage =
        wrap(StatsdClient.prototype.sendMessage, function (originalSendMessage, message, callback) {
            console.log('send metric', message)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            originalSendMessage.call(this, message, callback)
        })
}