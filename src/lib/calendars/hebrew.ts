import { JDNToGregorian } from './../'

interface HebrewDate {
	year: number
	month: number // 1-12/13
	day: number // 1-29/30
}
export const JewishHolidays = {
	// Calculate Rosh Hashanah (Jewish New Year)
	calculateRoshHashanah(gregorianYear: number): Date[] {
		// Convert approximate Gregorian to Hebrew year
		const hebrewYear = gregorianYear + 3761
		const roshHashanah = HebrewCalendarUtils.toJDN({
			year: hebrewYear,
			month: 7, // Tishri
			day: 1
		})
		const greg = JDNToGregorian(roshHashanah)
		return [new Date(greg.year, greg.month, greg.day)]
	},

	// Calculate Yom Kippur
	calculateYomKippur(gregorianYear: number): Date[] {
		const hebrewYear = gregorianYear + 3761
		const yomKippur = HebrewCalendarUtils.toJDN({
			year: hebrewYear,
			month: 7, // Tishri
			day: 10
		})
		const greg = JDNToGregorian(yomKippur)
		return [new Date(greg.year, greg.month, greg.day)]
	},

	// Calculate Hanukkah (8 days)
	calculateHanukkah(gregorianYear: number): Date[] {
		const dates: Date[] = []
		const hebrewYear = gregorianYear + 3761

		// Hanukkah starts on 25th of Kislev
		const currentJDN = HebrewCalendarUtils.toJDN({
			year: hebrewYear,
			month: 9, // Kislev
			day: 25
		})

		// Add all 8 days
		for (let i = 0; i < 8; i++) {
			const greg = JDNToGregorian(currentJDN + i)
			dates.push(new Date(greg.year, greg.month, greg.day))
		}
		return dates
	},

	// Calculate Passover (8 days outside Israel, 7 in Israel)
	calculatePassover(gregorianYear: number): Date[] {
		const dates: Date[] = []
		const hebrewYear = gregorianYear + 3761

		const currentJDN = HebrewCalendarUtils.toJDN({
			year: hebrewYear,
			month: 1, // Nisan
			day: 15
		})

		// Add all 8 days (can be adjusted to 7 for Israel)
		for (let i = 0; i < 8; i++) {
			const greg = JDNToGregorian(currentJDN + i)
			dates.push(new Date(greg.year, greg.month, greg.day))
		}
		return dates
	},

	// Calculate Shavuot
	calculateShavuot(gregorianYear: number): Date[] {
		const hebrewYear = gregorianYear + 3761
		const shavuot = HebrewCalendarUtils.toJDN({
			year: hebrewYear,
			month: 3, // Sivan
			day: 6
		})
		const greg = JDNToGregorian(shavuot)
		return [new Date(greg.year, greg.month, greg.day)]
	},

	// Calculate Sukkot (7 days + Shemini Atzeret/Simchat Torah)
	calculateSukkot(gregorianYear: number): Date[] {
		const dates: Date[] = []
		const hebrewYear = gregorianYear + 3761

		const currentJDN = HebrewCalendarUtils.toJDN({
			year: hebrewYear,
			month: 7, // Tishri
			day: 15
		})

		// Add 9 days (7 for Sukkot + Shemini Atzeret + Simchat Torah)
		for (let i = 0; i < 9; i++) {
			const greg = JDNToGregorian(currentJDN + i)
			dates.push(new Date(greg.year, greg.month, greg.day))
		}
		return dates
	}
}

interface HebrewMonthData {
	readonly name: string
	readonly days: number
	readonly daysLeap: number
}

const HebrewCalendarUtils = {
	// Determine if Hebrew year is a leap year
	isLeapYear(year: number): boolean {
		return (7 * year + 1) % 19 < 7
	},

	// Calculate number of days in Hebrew year
	daysInYear(year: number): number {
		return (
			this.toJDN({ year: year + 1, month: 7, day: 1 }) -
			this.toJDN({ year: year, month: 7, day: 1 })
		)
	},

	HEBREW_EPOCH: 347995.5, // Julian day number of Hebrew epoch (7 October 3761 BCE)

	// Hebrew months data
	MONTHS: new Map<number, HebrewMonthData>([
		[1, { name: 'Nisan', days: 30, daysLeap: 30 }],
		[2, { name: 'Iyar', days: 29, daysLeap: 29 }],
		[3, { name: 'Sivan', days: 30, daysLeap: 30 }],
		[4, { name: 'Tammuz', days: 29, daysLeap: 29 }],
		[5, { name: 'Av', days: 30, daysLeap: 30 }],
		[6, { name: 'Elul', days: 29, daysLeap: 29 }],
		[7, { name: 'Tishri', days: 30, daysLeap: 30 }],
		[8, { name: 'Cheshvan', days: 29, daysLeap: 29 }],
		[9, { name: 'Kislev', days: 30, daysLeap: 30 }],
		[10, { name: 'Tevet', days: 29, daysLeap: 29 }],
		[11, { name: 'Shevat', days: 30, daysLeap: 30 }],
		[12, { name: 'Adar', days: 29, daysLeap: 30 }],
		[13, { name: 'Adar II', days: 0, daysLeap: 29 }]
	]),

	// Calculate Hebrew year type (deficient, regular, complete)
	getYearType(year: number): 'deficient' | 'regular' | 'complete' {
		const days = this.daysInYear(year)
		const isLeap = this.isLeapYear(year)
		if (isLeap) {
			if (days === 383) return 'deficient'
			if (days === 384) return 'regular'
			if (days === 385) return 'complete'
		} else {
			if (days === 353) return 'deficient'
			if (days === 354) return 'regular'
			if (days === 355) return 'complete'
		}
		throw new Error('Invalid year length')
	},

	// Convert Hebrew date to Julian Day Number
	toJDN(date: HebrewDate): number {
		let jdn = this.HEBREW_EPOCH
		const elapsed = this.elapsedDays(date.year)
		const monthStart = this.monthsElapsed(date.year, date.month)

		jdn += elapsed + monthStart + (date.day - 1)

		// Apply postponement rules (dehiyyot)
		if (
			this.getDayOfWeek(jdn) === 0 || // No Rosh Hashana on Sunday
			this.getDayOfWeek(jdn) === 3 || // Wednesday
			this.getDayOfWeek(jdn) === 5
		) {
			// Friday
			jdn += 1
		}

		return Math.floor(jdn)
	},

	// Convert Julian Day Number to Hebrew date
	fromJDN(jdn: number): HebrewDate {
		const _jdn = Math.floor(jdn) + 0.5
		const count = Math.floor(
			((_jdn - this.HEBREW_EPOCH) * 98496.0) / 35975351.0
		)
		let year = count - 1
		let i = count
		while (_jdn >= this.toJDN({ year: i, month: 7, day: 1 })) {
			i++
		}
		year = i - 1

		const firstMonth = this.isLeapYear(year) ? 13 : 12
		let month = firstMonth
		while (
			_jdn >
			this.toJDN({ year, month: month, day: this.getDaysInMonth(year, month) })
		) {
			month--
		}

		const day = 1 + _jdn - this.toJDN({ year, month, day: 1 })

		return { year, month, day }
	},

	// Calculate elapsed days since Hebrew epoch with proper conjunction parts handling
	elapsedDays(year: number): number {
		// First calculate base days without postponements
		let monthsElapsed = Math.floor(
			235 * ((year - 1) / 19) + (12084 + 13753) / 25920
		)
		let partsElapsed = 204 + 793 * (monthsElapsed % 1080)
		let hoursElapsed =
			5 +
			12 * monthsElapsed +
			793 * (monthsElapsed / 1080) +
			partsElapsed / 1080
		let conjunctionDay = 1 + 29 * monthsElapsed + Math.floor(hoursElapsed / 24)
		let conjunctionParts = (hoursElapsed % 24) * 1080 + (partsElapsed % 1080)

		// Apply postponement rules (dehiyyot)
		let postponedDay = conjunctionDay

		// Rule 1: Lo ADU Rosh - New Year cannot fall on Sunday(1), Wednesday(4), or Friday(6)
		let dayOfWeek = postponedDay % 7
		if (dayOfWeek === 1 || dayOfWeek === 4 || dayOfWeek === 6) {
			postponedDay++
		}

		// Rule 2: Molad Zaken - If conjunction occurs after 18 hours, postpone
		if (conjunctionParts >= 19440) {
			postponedDay++
			dayOfWeek = postponedDay % 7
			// Recheck Rule 1 after Molad Zaken postponement
			if (dayOfWeek === 1 || dayOfWeek === 4 || dayOfWeek === 6) {
				postponedDay++
			}
		}

		// Rule 3: GaTaRaD - In a non-leap year, if conjunction occurs on
		// Tuesday after 9 hours and 204 parts or later, postpone to Thursday
		if (!this.isLeapYear(year) && dayOfWeek === 2 && conjunctionParts >= 9924) {
			postponedDay += 2
		}

		// Rule 4: BeTuTaKFoT - In a year following a leap year, if conjunction
		// occurs on Monday after 15 hours and 589 parts or later, postpone to Tuesday
		if (
			!this.isLeapYear(year - 1) &&
			dayOfWeek === 1 &&
			conjunctionParts >= 16789
		) {
			postponedDay++
		}

		return postponedDay
	},

	// Calculate months elapsed in Hebrew year
	monthsElapsed(year: number, month: number): number {
		let monthsElapsed = 0
		const isLeap = this.isLeapYear(year)

		for (let i = 1; i < month; i++) {
			const monthData = this.MONTHS.get(i)
			if (!monthData) continue
			monthsElapsed += isLeap ? monthData.daysLeap : monthData.days
		}

		return monthsElapsed
	},

	// Get day of week from Julian Day Number
	getDayOfWeek(jdn: number): number {
		return (jdn + 1) % 7
	},

	// Get number of days in Hebrew month
	getDaysInMonth(year: number, month: number): number {
		const monthData = this.MONTHS.get(month)
		if (!monthData) throw new Error('Invalid month')
		return this.isLeapYear(year) ? monthData.daysLeap : monthData.days
	}
}
