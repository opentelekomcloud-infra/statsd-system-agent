import { loadCustomConfiguration } from './config'
import { CpuMonitor } from './monitors/cpu-monitor'
import { MemoryMonitor } from './monitors/memory-monitor';
import { NetworkMonitor } from './monitors/network-monitor';
import { DiskMonitor } from './monitors/disk-monitor';

const config = loadCustomConfiguration()
const monitors: any[] = [];

function loadMonitors() {
    const monitorNames = config.monitorNames
    if (monitors.length > 0) {
        return
    }
    monitorNames.forEach(name => {
        switch (name) {
        case 'cpu-monitor':
            try {
                const monitor = new CpuMonitor(config)
                monitors.push(monitor)
            } catch (err) {
                console.error(`Could not load monitor ${name}`, err.stack || err)
            }
            break
        case 'memory-monitor':
            try {
                const monitor = new MemoryMonitor(config)
                monitors.push(monitor)
            } catch (err) {
                console.error(`Could not load monitor ${name}`, err.stack || err)
            }
            break
        case 'network-monitor':
            try {
                const monitor = new NetworkMonitor(config)
                monitors.push(monitor)
            } catch (err) {
                console.error(`Could not load monitor ${name}`, err.stack || err)
            }
            break
        case 'disk-monitor':
            try {
                const monitor = new DiskMonitor(config)
                monitors.push(monitor)
            } catch (err) {
                console.error(`Could not load monitor ${name}`, err.stack || err)
            }
            break
        default:
            console.log(`Monitor ${name} not implemented`)
            break
        }
    })

    console.log(`${monitors.length} monitors loaded.`)
}

async function collectStatistics() {
    for (const monitor of monitors) {
        console.log(`Collecting statistics (${monitor.name} monitor)...`)
        await monitor.collect();
        console.log(`Collected statistics (${monitor.name} monitor)...`)
    }
}

function sendStatistics() {
    for (const monitor of monitors) {
        console.log(`Sending statistics (${monitor.name} monitor)...`)
        monitor.sendStatistics()
        console.log(`Sent statistics (${monitor.name} monitor).`)
        monitor.clearStatistics()
    }
}

export function start(): void {
    loadMonitors()

    console.log('Start collecting statistics...')
    collectStatistics()
    setInterval(collectStatistics, config.collectStatisticsInterval)

    console.log('Start sending statistics...')
    setInterval(sendStatistics, config.sendStatisticsInterval)
}

start()
