import debug from 'debug'
import { snakeCase } from 'change-case'
import { client } from '../../utils/statsd-client'
import { ConfigDefault } from '../../config.default';
import { StatsD } from 'hot-shots'

const debugSt = debug('statsd-agent:statistic')

export class Statistic {
    private statsdName: string
    private value: any
    private client: StatsD;
    constructor(config: ConfigDefault, statsdName: string, value: any) {
        this.statsdName = statsdName.split('.').map((s: string) => snakeCase(s)).join('.')
        this.value = value
        this.client = client(config)
    }

    send(): boolean {
        console.log(`Sending statistics ${this.statsdName}...`)
        debugSt('Sending statistic %s = %d', this.statsdName, this.value)
        try {
            this.client.gauge(this.statsdName, this.value)
        } catch (err) {
            return false
        }
        return true
    }
}
