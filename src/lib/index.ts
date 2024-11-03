export interface GregorianDate {
	year: number
	month: number // 0-11
	day: number // 1-31
}

export const gregorianToJDN = (date: GregorianDate): number => {
	const { year, month, day } = date
	const a = Math.floor((14 - (month + 1)) / 12)
	const y = year + 4800 - a
	const m = month + 1 + 12 * a - 3
	return (
		day +
		Math.floor((153 * m + 2) / 5) +
		365 * y +
		Math.floor(y / 4) -
		Math.floor(y / 100) +
		Math.floor(y / 400) -
		32045
	)
}

export const JDNToGregorian = (jdn: number): GregorianDate => {
	const j = jdn + 32044
	const g = Math.floor(j / 146097)
	const dg = j % 146097
	const c = Math.floor(((Math.floor(dg / 36524) + 1) * 3) / 4)
	const dc = dg - c * 36524
	const b = Math.floor(dc / 1461)
	const db = dc % 1461
	const a = Math.floor(((Math.floor(db / 365) + 1) * 3) / 4)
	const da = db - a * 365
	const y = g * 400 + c * 100 + b * 4 + a
	const m = Math.floor((da * 5 + 308) / 153) - 2
	const d = da - Math.floor(((m + 4) * 153) / 5) + 122
	const year = y - 4800 + Math.floor((m + 2) / 12)
	const month = (m + 2) % 12
	const day = d + 1
	return { year, month, day }
}

export const isDateInRange = (
	date: Date,
	startMonth: number,
	startDay: number,
	endMonth: number,
	endDay: number
): boolean => {
	const start = new Date(date.getFullYear(), startMonth, startDay)
	const end = new Date(date.getFullYear(), endMonth, endDay)
	return date >= start && date <= end
}

// Date comparison ignoring time
export const isSameDay = (date1: Date, date2: Date): boolean => {
	console.log('date1', date1)
	console.log('date2', date2)

	return (
		date1.getUTCFullYear() === date2.getUTCFullYear() &&
		date1.getUTCMonth() === date2.getUTCMonth() &&
		date1.getUTCDate() === date2.getUTCDate()
	)
}

// Get nth weekday of month (e.g., 3rd Thursday)
export const getNthWeekday = (date: Date, n: number, weekday: number): Date => {
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
	const firstWeekday = new Date(firstDay)
	while (firstWeekday.getDay() !== weekday) {
		firstWeekday.setDate(firstWeekday.getDate() + 1)
	}
	firstWeekday.setDate(firstWeekday.getDate() + (n - 1) * 7)
	return firstWeekday
}

// Calculate Thanksgiving (US & Canada have different dates)
export const getThanksgiving = (date: Date, isUS: boolean): Date => {
	// US: Fourth Thursday of November
	// Canada: Second Monday of October
	const month = isUS ? 10 : 9 // 0-based months
	const weekNumber = isUS ? 4 : 2
	const dayOfWeek = isUS ? 4 : 1 // 0 = Sunday, 1 = Monday, etc.
	return getNthWeekday(
		new Date(date.getFullYear(), month, 1),
		weekNumber,
		dayOfWeek
	)
}
