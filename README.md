statsd-system-agent
============

Statsd agent to monitor CPU, Memory, Disk and Network based on Node JS and Typescript

## Installation
Before all, install Node js >v13.x.x with npm

Then:
```
git clone https://github.com/anton-sidelnikov/statsd-system-agent.git
```
* cd statsd-system-agent
* npm install
* npm run build

## Run

* npm run start

The agent will starts and statistics will sends to specified address, by default stored in /tmp/config.custom
```
> statsd-system-agent@0.1.0 start
> node --experimental-specifier-resolution=node dist/app.js

Loading configuration...
3 monitors loaded.
Start collecting statistics...
Start sending statistics...

```
## Configuration
```
config.custom

{
  "statisticBlackList":[],
  "monitorNames":["cpu-monitor","memory-monitor","network-monitor"],  # list of monitors
  "collectStatisticsInterval":10000,                                  # collect interval
  "sendStatisticsInterval":10000,                                     # send interval
  "statsdConfig":{
    "prefix":"test_prefix",                                           # top level prefix under stats.gauges
    "env":"production",                                               # next level folder under gauges
    "host":"localhost",                                               # statsd ip address
    "debug":false                                                     # debug mode
  }
}
```
