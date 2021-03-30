import { readFileSync } from 'fs-extra';

export interface ConfigDefault {
    statisticBlackList: string[];
    monitorNames: string[]
    collectStatisticsInterval: number
    sendStatisticsInterval: number
    statsdConfig: StatsdConfig
}

interface StatsdConfig {
    prefix: string
    env: string
    host: string
    debug: boolean
}

export function createDefaultConfig(): string {
    let config = readFileSync(__dirname +'/config/default.json', 'utf8')
    config = JSON.parse(config)
    return config
}
