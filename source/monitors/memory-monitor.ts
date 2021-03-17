import { Monitor } from './entities/monitor'
import { mem } from 'systeminformation'

export class MemoryMonitor extends Monitor {
    constructor() {
        super('memory');
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
