import { existsSync, writeFileSync, readFileSync } from 'fs-extra'
import { ConfigDefault, createDefaultConfig } from './config.default'

export function loadCustomConfiguration(path='/tmp'): ConfigDefault {
    let customConfig
    if (existsSync(path + '/config.custom')) {
        console.log('Loading configuration...')

        customConfig = readFileSync(path +'/config.custom', 'utf8')
        customConfig = JSON.parse(customConfig)
    } else {
        console.log('Creating default configuration file...')
        const config = createDefaultConfig()
        writeFileSync(path +'/config.custom', JSON.stringify(config) , 'utf-8')

        loadCustomConfiguration(path)
    }
    return customConfig
}
