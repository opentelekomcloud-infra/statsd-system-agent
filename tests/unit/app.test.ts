/// <reference types="jest" />
/**
 * @jest-environment node
 */
import { Statistic } from '../../source/monitors/entities/stat';
import WS from 'jest-websocket-mock';
import { CpuMonitor } from '../../source/monitors/cpu-monitor';
import { MemoryMonitor } from '../../source/monitors/memory-monitor';
import { NetworkMonitor } from '../../source/monitors/network-monitor';
import { DiskMonitor } from '../../source/monitors/disk-monitor';

const server = new WS('ws://localhost:8125');

afterAll(() => {
    server.close()
})

const testConfig = {
    'statisticBlackList':[],
    'monitorNames':['cpu-monitor','memory-monitor','disk-monitor','network-monitor'],
    'collectStatisticsInterval':10000,
    'sendStatisticsInterval':10000,
    'statsdConfig':{
        'prefix':'csm',
        'env':'production_eu-de',
        'host':'localhost',
        'debug':false
    }
}
test('statistic push', () => {
    const testStat = new Statistic (testConfig,'cpu.user','2.96')
    const resp = testStat.send()
    expect(resp).toEqual(true)
})

test('cpu-monitor', () => {
    const monitor = new CpuMonitor()
    expect(monitor.name).toEqual('cpu')
    // set currentCpuTimes
    monitor.collect()
    expect(monitor.currentCpuTimes).toHaveProperty('user')
    expect(monitor.currentCpuTimes).toHaveProperty('idle')
    expect(monitor.currentCpuTimes).toHaveProperty('nice')
    expect(monitor.currentCpuTimes).toHaveProperty('sys')
    expect(monitor.currentCpuTimes).toHaveProperty('irq')
    // set statistics
    monitor.collect()
    monitor.clearStatistics()
    expect(monitor.statistics).toEqual([])
})

test('memory-monitor', async () => {
    const monitor = new MemoryMonitor()
    expect(monitor.name).toEqual('memory')
    // set statistics
    await monitor.collect()
    expect(monitor.statistics.length).toEqual(3)
    monitor.clearStatistics()
    expect(monitor.statistics).toEqual([])
})

test('network-monitor',async () => {
    const monitor = new NetworkMonitor()
    expect(monitor.name).toEqual('network')
    // set statistics
    await monitor.collect()
    expect(monitor.statistics.length).toEqual(7)
    monitor.clearStatistics()
    expect(monitor.statistics).toEqual([])
})

test('disk-monitor',async () => {
    const monitor = new DiskMonitor()
    expect(monitor.name).toEqual('disk')
    // set statistics
    await monitor.collect()
    expect(monitor.statistics).not.toEqual([])
    monitor.clearStatistics()
    expect(monitor.statistics).toEqual([])
})