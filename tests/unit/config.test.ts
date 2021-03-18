/// <reference types="jest" />
/**
 * @jest-environment node
 */
import { loadCustomConfiguration } from '../../source/config';


test('simple default config load', () => {
    const config = loadCustomConfiguration(__dirname)
    expect(config.monitorNames).toEqual( ['cpu-monitor','memory-monitor','disk-monitor','network-monitor'])
    expect(config.collectStatisticsInterval).toEqual( 10000)
    expect(config.sendStatisticsInterval).toEqual( 10000)
    expect(config.statsdConfig).toEqual({
        'prefix': 'system',
        'host': 'localhost',
        'debug': false
    })
})
