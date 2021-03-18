import { Monitor } from './entities/monitor'
import { mem } from 'systeminformation'
import { ConfigDefault } from '../config.default';

export class MemoryMonitor extends Monitor {
    constructor(config: ConfigDefault) {
        super(config,'memory');
    }

    async collect(): Promise<void> {
        const data = await mem()
        try {
            this.setStatistics([
                ['free', data.free],
                ['total', data.total],
                ['used', data.used],
            ])
        }
        catch (e) {
            console.error('Memory info cannot be read', e.stack || e)
        }
    }
}
