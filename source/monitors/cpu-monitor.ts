import { Monitor } from './entities/monitor';
import * as os from 'os';
import { ConfigDefault } from '../config.default';

interface CpuTimes {
    idle: number
    irq: number
    sys: number
    user: number
    nice: number
}

function round(value: number, total: number, fraction = 2): string {
    return ((value / total) * 100).toFixed(fraction)
}

export class CpuMonitor extends Monitor {
    public currentCpuTimes: CpuTimes | undefined

    constructor(config: ConfigDefault) {
        super(config, 'cpu')
    }

    collect(): void {
        const intervalCpuTimes = this.getIntervalCpuTimes();
        if (intervalCpuTimes == null)
            return;

        const totalIntervalCpuTime =
            + intervalCpuTimes.user
            + intervalCpuTimes.nice
            + intervalCpuTimes.sys
            + intervalCpuTimes.idle
            + intervalCpuTimes.irq

        this.setStatistics(
            Object.entries({
                'user': round(intervalCpuTimes.user, totalIntervalCpuTime),
                'nice': round(intervalCpuTimes.nice, totalIntervalCpuTime),
                'sys': round(intervalCpuTimes.sys, totalIntervalCpuTime),
                'idle': round(intervalCpuTimes.idle, totalIntervalCpuTime),
                'irq': round(intervalCpuTimes.irq, totalIntervalCpuTime)
            })
        )
    }

    getIntervalCpuTimes(): CpuTimes | null {
        const newCpuTimes = this.getCpuTimes();

        if (this.currentCpuTimes == null) {
            this.currentCpuTimes = newCpuTimes;

            return null;
        }

        const intervalCpuTimes = {
            user: newCpuTimes.user - this.currentCpuTimes.user,
            nice: newCpuTimes.nice - this.currentCpuTimes.nice,
            sys: newCpuTimes.sys - this.currentCpuTimes.sys,
            idle: newCpuTimes.idle - this.currentCpuTimes.idle,
            irq: newCpuTimes.irq - this.currentCpuTimes.irq
        };

        this.currentCpuTimes = newCpuTimes;

        return intervalCpuTimes;
    }

    getCpuTimes(): CpuTimes {
        const cpusInfo = os.cpus();

        const newCpuTimes = {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        }

        cpusInfo.forEach(cpu => {
            newCpuTimes.user += cpu.times.user;
            newCpuTimes.nice += cpu.times.nice;
            newCpuTimes.sys += cpu.times.sys;
            newCpuTimes.idle += cpu.times.idle;
            newCpuTimes.irq += cpu.times.irq;
        })

        return newCpuTimes;
    }
}
