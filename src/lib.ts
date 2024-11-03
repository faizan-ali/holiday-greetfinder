// Using Intl.DateTimeFormat for reliable timezone conversion
import test from 'node:test'

export const getDateInTimezone = (
	date: Date,
	timezone?: string
): { year: number; month: number; day: number } => {
	try {
		const formatter = new Intl.DateTimeFormat('en-US', {
			timeZone: timezone,
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		})

		const parts = formatter.formatToParts(date)
		const dateParts = parts.reduce(
			(acc, part) => {
				if (
					part.type === 'month' ||
					part.type === 'day' ||
					part.type === 'year'
				) {
					acc[part.type] = Number.parseInt(part.value, 10)
				}
				return acc
			},
			{} as { year: number; month: number; day: number }
		)

		return {
			year: dateParts.year,
			month: dateParts.month, // 1-based month
			day: dateParts.day
		}
	} catch (error) {
		// If timezone is invalid, fall back to local date
		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		}
	}
}

// Helper to compare just the date portions using specified timezone
export const isSameDay = (
	date1: Date,
	date2: Date,
	timezone?: string
): boolean => {
	const d1 = getDateInTimezone(date1, timezone)
	const d2 = getDateInTimezone(date2, timezone)

	return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day
}

// Helper to check if a date matches a month/day specification
export const isMonthDayMatch = (
	date: Date,
	monthDay: { month: number; day: number },
	timezone?: string
): boolean => {
	const d = getDateInTimezone(date, timezone)
	return d.month === monthDay.month && d.day === monthDay.day
}

export const isDateMatch = (
	dateStr: string,
	holidayDate: string | { month: number; day: number }
): boolean => {
	// For YYYY-MM-DD string format
	if (typeof holidayDate === 'string') {
		return dateStr === holidayDate
	}

	// Parse the input date string (expecting YYYY-MM-DD format)
	const [_, month, day] = dateStr.split('-').map(Number)
	// For month/day object format
	return month === holidayDate.month && day === holidayDate.day
}
