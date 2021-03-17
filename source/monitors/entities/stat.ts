import debug from 'debug'
import { snakeCase } from 'change-case'
import { statsdClient } from '../../utils/statsd-client'

const debugSt = debug('statsd-agent:statistic')
const client = statsdClient

export class Statistic {
    private statsdName: string
    private value: any
    constructor(statsdName: string, value: any) {
        this.statsdName = statsdName.split('.').map((s: string) => snakeCase(s)).join('.')
        this.value = value
    }

    send(): boolean {
        debugSt('Sending statistic %s = %d', this.statsdName, this.value)
        try {
            client.gauge(this.statsdName, this.value)
        } catch (err) {
            return false
        }

        return true
    }
}