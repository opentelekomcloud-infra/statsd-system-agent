import { Monitor } from './entities/monitor'
import { blockDevices } from 'systeminformation'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { raw } from 'disk-stat'
import { ConfigDefault } from '../config.default';

//only on *nix system
export class DiskMonitor extends Monitor {
    constructor(config: ConfigDefault) {
        super(config,'disk');
    }

    async collect(): Promise<void> {
        const disksList: string[] = []
        const diskStatisticsList: string[][] = []
        const data = await blockDevices()
        try {
            for (const disk of data){
                disksList.push(disk.name)
            }
        }
        catch (e) {
            console.error('Disk info cannot be read', e.stack || e)
        }
        const disksInfo = raw()
        const statisticsList = []
        for (const disk of disksList) {
            statisticsList.push(
                ['readsCompleted', disksInfo[disk].readsCompleted],
                ['readsMerged', disksInfo[disk].readsMerged],
                ['sectorsRead', disksInfo[disk].sectorsRead],
                ['msReading', disksInfo[disk].msReading],
                ['writesCompleted', disksInfo[disk].writesCompleted],
                ['writesMerged', disksInfo[disk].writesMerged],
                ['sectorsWritten', disksInfo[disk].sectorsWritten],
                ['msWriting', disksInfo[disk].msWriting],
                ['iosPending', disksInfo[disk].iosPending],
                ['msIo', disksInfo[disk].msIo],
                ['msWeightedIo', disksInfo[disk].msWeightedIo])
            for (const stat of statisticsList)
                diskStatisticsList.push([`${disk}_${stat[0]}`, stat[1]])
        }
        this.setStatistics (diskStatisticsList)
    }
}
