import { wrap } from 'underscore'
import { hostname } from 'os'
import { StatsD } from 'hot-shots'
import StatsdClient from 'hot-shots'
import { loadCustomConfiguration } from '../config'
import { ConfigDefault } from '../config.default';

const statsdConfig = loadCustomConfiguration().statsdConfig

export function client(config: ConfigDefault): StatsD{
    const client = new StatsdClient({
        host: config.statsdConfig.host,
        cacheDns: true,
        telegraf: true,
        errorHandler: (err: Error) => console.error(err.stack || err),
        prefix: `${config.statsdConfig.prefix}.${config.statsdConfig.env}.system.${hostname()}_`,
        globalTags: {}
    })

    if (statsdConfig.debug) {
        StatsdClient.prototype.sendMessage =
            wrap(StatsdClient.prototype.sendMessage,
                function (originalSendMessage: unknown, message: unknown, callback: unknown) {
                    console.log('send metric', message)
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    originalSendMessage.call(this, message, callback)
                })
    }
    return client
}
