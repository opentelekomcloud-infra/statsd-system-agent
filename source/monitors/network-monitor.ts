import { Monitor } from './entities/monitor'
import { networkStats, networkInterfaceDefault } from 'systeminformation'
import { ConfigDefault } from '../config.default';

export class NetworkMonitor extends Monitor {
    constructor(config: ConfigDefault) {
        super(config,'network');
    }

    async collect(): Promise<void> {
        const defaultIf = await networkInterfaceDefault()
        const stats = await networkStats(defaultIf)
        try {
            this.setStatistics(
                Object.entries(
                    { 'rx_bytes': stats[0].rx_bytes,
                        'rx_dropped': stats[0].rx_dropped,
                        'tx_bytes': stats[0].tx_bytes,
                        'tx_dropped': stats[0].tx_dropped,
                        'rx_sec': stats[0].rx_sec,
                        'tx_sec': stats[0].tx_sec,
                        'ms': stats[0].ms
                    })
            )
        }
        catch (e) {
            console.error('Network info cannot be read', e.stack || e)
        }
    }
}
