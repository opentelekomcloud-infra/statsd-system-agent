import { loadCustomConfiguration } from '../../config';
import { Statistic } from './stat'
import debug from 'debug'
import { isEmpty } from 'underscore'
import { ConfigDefault } from '../../config.default';

const config = loadCustomConfiguration()
const debugMon = debug('statsd-agent:statistic')

export class Monitor {
    public statistics: Statistic[];
    public name: string;

    constructor(config: ConfigDefault, name: string) {
        this.name = name
        this.statistics = []
    }


    setStatistics(statisticsPairs: any[]): void {
        debugMon('Setting statistics (%s)...', this.name, statisticsPairs)
        let statisticBlackList: Set<string>
        if (!isEmpty(config.statisticBlackList)) {
            statisticBlackList = new Set(config.statisticBlackList.map(statisticName => statisticName.toLowerCase()))
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (statisticBlackList) {
            statisticsPairs =
                statisticsPairs
                    .filter(statisticsPair => !statisticBlackList.has(`${this.name}.${statisticsPair[0]}`.toLowerCase()))
        }

        this.statistics =
            statisticsPairs
                .map(statisticsPair =>
                    new Statistic(config,`${this.name}.${statisticsPair[0]}`, statisticsPair[1]))
    }

    sendStatistics(): void {
        debug('Sending statistics...')
        const statistics = this.statistics

        statistics.forEach(stat => {
            stat.send()
        })
    }

    clearStatistics(): void {
        this.statistics = []
    }
}
