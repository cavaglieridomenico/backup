import { TIME_RANGE_INTERVAL } from "./constants";
import { subtractHoursFromDate } from "./functions";

const endRange = (hours: number) => subtractHoursFromDate(hours)

const startRange = (hours: number, timeInterval: number = TIME_RANGE_INTERVAL) => subtractHoursFromDate(timeInterval, endRange(hours))

export const orderTimeInterval = (startTime: number) => `[${startRange(startTime).toISOString()} TO ${endRange(startTime).toISOString()}]`

export const numberOfPages = (total: number, pageSize: number) => Math.floor(total / pageSize) + 1

