import { loadCustomConfiguration } from '../../config';
import { Statistic } from './stat'
import debug from 'debug'
import { isEmpty } from 'underscore'

const config = loadCustomConfiguration()

const debugMon = debug('statsd-agent:statistic')
let statisticBlackList: Set<string>

if (!isEmpty(config.statisticBlackList)) {
    statisticBlackList = new Set(config.statisticBlackList.map(statisticName => statisticName.toLowerCase()))
}

export class Monitor {
    public statistics: any[];
    public name: string;

    constructor(name: string) {
        this.name = name
        this.statistics = []
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    setStatistics(statisticsPairs: any[]) {
        debugMon('Setting statistics (%s)...', this.name, statisticsPairs)

        if (statisticBlackList) {
            statisticsPairs =
                statisticsPairs
                    .filter(statisticsPair => !statisticBlackList.has(`${this.name}.${statisticsPair[0]}`.toLowerCase()))
        }

        this.statistics =
            statisticsPairs
                .map(statisticsPair =>
                    new Statistic(`${this.name}.${statisticsPair[0]}`, statisticsPair[1]))
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    sendStatistics() {
        debug('Sending statistics...')

        const statistics = this.statistics

        for (let i = 0; i < statistics.length; i++) {
            const statistic = statistics[i]

            statistic.send()
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    clearStatistics() {
        this.statistics = []
    }
}