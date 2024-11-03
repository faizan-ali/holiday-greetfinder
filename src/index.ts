import { holidays } from './holidays'
import { isDateMatch, isMonthDayMatch, isSameDay } from './lib'

export interface Holiday {
	greeting: string
	emoji: string
	dates: Array<string | { month: number; day: number }>
}

/**
 * Get holiday greetings for a specific date and timezone
 * @param date The date to check for holidays
 * @param timezone Optional IANA timezone identifier (e.g., 'America/Los_Angeles', 'Asia/Tokyo')
 * @returns Array of holiday greetings that match the date in the specified timezone
 */
export const getHolidayGreeting = (
	date: Date,
	timezone?: string
): Array<Omit<Holiday, 'dates'>> => {
	let _timezone = timezone
	// Validate timezone if provided
	if (timezone) {
		try {
			// Test if timezone is valid
			Intl.DateTimeFormat('en-US', { timeZone: timezone })
		} catch (error) {
			console.warn(
				`Invalid timezone: ${timezone}. Falling back to local timezone.`
			)
			_timezone = undefined
		}
	}

	return holidays
		.filter(holiday => {
			return holiday.dates.some(holidayDate => {
				if (typeof holidayDate === 'string') {
					// For specific dates (YYYY-MM-DD format)
					const specifiedDate = new Date(holidayDate)
					return isSameDay(date, specifiedDate, _timezone)
				}

				// For month/day specifications
				return isMonthDayMatch(date, holidayDate, _timezone)
			})
		})
		.map(({ greeting, emoji }) => ({ greeting, emoji }))
}

const createHolidayChecker = (greeting: string) => {
	return (dateStr: string, timezone?: string): boolean => {
		// Extract just the YYYY-MM-DD part if there's more
		const simpleDateStr = dateStr.split('T')[0]

		const holiday = holidays.find(h => h.greeting === greeting)
		if (!holiday) return false

		return holiday.dates.some(holidayDate =>
			isDateMatch(simpleDateStr, holidayDate)
		)
	}
}

export const isChristmas = createHolidayChecker('Merry Christmas')
export const isChristmasEve = createHolidayChecker('Happy Christmas Eve')
export const isEidMubarak = createHolidayChecker('Eid Mubarak')
export const isHanukkah = createHolidayChecker('Happy Hanukkah')
export const isPassover = createHolidayChecker('Chag Pesach Sameach')
export const isRoshHashanah = createHolidayChecker('Shana Tova')
export const isDiwali = createHolidayChecker('Happy Diwali')
export const isEaster = createHolidayChecker('Happy Easter')
export const isEarthDay = createHolidayChecker('Happy Earth Day')
export const isValentinesDay = createHolidayChecker("Happy Valentine's Day")
export const isHalloween = createHolidayChecker('Happy Halloween')
export const isNewYear = createHolidayChecker('Happy New Year')
export const isThanksgiving = createHolidayChecker('Happy Thanksgiving')
export const isFathersDay = createHolidayChecker("Happy Father's Day")
export const isMothersDay = createHolidayChecker("Happy Mother's Day")
export const isIndependenceDay = createHolidayChecker(
	'Happy US Independence Day'
)
export const isStPatricksDay = createHolidayChecker("Happy St. Patrick's Day")
export const isCincoDeMayo = createHolidayChecker('¡Feliz Cinco de Mayo!')
export const isAfricaDay = createHolidayChecker('Happy Africa Day')
export const isPride = createHolidayChecker('Happy Pride')
export const isHoli = createHolidayChecker('Happy Holi')
export const isYomKippur = createHolidayChecker("G'mar Chatima Tova")
export const isCanadianThanksgiving = createHolidayChecker(
	'Happy Canadian Thanksgiving'
)
export const isLunarNewYear = createHolidayChecker('Happy Lunar New Year')
export const isCarnival = createHolidayChecker('Happy Carnival')
export const isJunkanoo = createHolidayChecker('Happy Junkanoo')
export const isNowruz = createHolidayChecker('Happy Nowruz')
export const isVesak = createHolidayChecker('Happy Vesak')
export const isDiaDeLosMuertos = createHolidayChecker(
	'¡Feliz Día de los Muertos!'
)
export const isOktoberfest = createHolidayChecker('Prost Oktoberfest!')
