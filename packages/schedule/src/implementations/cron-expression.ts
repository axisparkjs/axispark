export enum CronExpression {
    EverySecond = '* * * * * *',
    Every5Seconds = '*/5 * * * * *',
    Every10Seconds = '*/10 * * * * *',
    Every15Seconds = '*/15 * * * * *',
    Every30Seconds = '*/30 * * * * *',

    EveryMinute = '0 * * * * *',
    Every5Minutes = '0 */5 * * * *',
    Every10Minutes = '0 */10 * * * *',
    Every15Minutes = '0 */15 * * * *',
    Every30Minutes = '0 */30 * * * *',

    EveryHour = '0 0 * * * *',
    Every2Hours = '0 0 */2 * * *',
    Every3Hours = '0 0 */3 * * *',
    Every6Hours = '0 0 */6 * * *',
    Every8Hours = '0 0 */8 * * *',
    Every12Hours = '0 0 */12 * * *',

    EveryDay = '0 0 0 * * *',

    EveryWeek = '0 0 0 * * 0',
    Weekdays = '0 0 0 * * 1-5',
    Weekends = '0 0 0 * * 6,0',

    EveryMonth = '0 0 0 1 * *',
    EveryYear = '0 0 0 1 1 *'
}
