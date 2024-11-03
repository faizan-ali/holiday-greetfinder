import { type GregorianDate, JDNToGregorian } from './../'

interface IslamicDate {
	year: number
	month: number // 1-12
	day: number // 1-29/30
}

// Astronomical constants
const ASTRONOMICAL = {
	ISLAMIC_EPOCH: 1948439.5,
	LUNAR_MONTH: 29.530588861,
	LUNAR_SYNODIC_PERIOD: 29.530588
}

export const IslamicHolidays = {
	isEidAlFitr(date: Date): boolean {
		const islamicDate = IslamicHolidayUtils.getIslamicDate(date)
		console.log('DATEX', islamicDate)
		// Eid al-Fitr is on 1st-3rd of Shawwal (10th month)
		return (
			islamicDate.month === 10 &&
			(islamicDate.day <= 3 || islamicDate.day >= 28.5)
		)
	},
	calculateEidAlFitr(gregorianYear: number): Date[] {
		const dates: Date[] = []

		try {
			// Eid al-Fitr starts on 1st of Shawwal (10th month)
			const eidStart = IslamicHolidayUtils.getIslamicMonthStart(
				gregorianYear,
				10
			)

			// Eid is celebrated for three days
			for (let i = 0; i < 3; i++) {
				const eidDate = new Date(eidStart)
				eidDate.setDate(eidStart.getDate() + i)
				dates.push(eidDate)
			}
		} catch (error) {
			console.error(
				`Error calculating Eid al-Fitr for ${gregorianYear}:`,
				error
			)
		}

		return dates
	},

	calculateEidAlAdha(gregorianYear: number): Date[] {
		const dates: Date[] = []
		// 10th-13th of Dhu al-Hijjah (12th month)
		const estimatedYear = Math.floor(((gregorianYear - 622) * 32) / 33)
		for (let day = 10; day <= 13; day++) {
			const eidDate = IslamicHolidayUtils.islamicToGregorian({
				year: estimatedYear,
				month: 12,
				day
			})
			dates.push(new Date(eidDate.year, eidDate.month, eidDate.day))
		}
		return dates
	}
}

// Islamic calendar helpers
export const IslamicHolidayUtils = {
	// Astronomical constants for Islamic calendar
	ISLAMIC_EPOCH: 1948439.5, // Julian date of start of Islamic calendar
	LUNAR_SYNODIC_MONTH: 29.530588, // Mean lunar month length

	// Convert Gregorian date to Julian Day Number
	gregorianToJDN(year: number, month: number, day: number): number {
		if (month < 3) {
			year -= 1
			month += 12
		}
		const a = Math.floor(year / 100)
		const b = 2 - a + Math.floor(a / 4)

		return (
			Math.floor(365.25 * (year + 4716)) +
			Math.floor(30.6001 * (month + 1)) +
			day +
			b -
			1524.5
		)
	},

	// Convert Julian Day Number to Islamic date
	jdnToIslamic(jdn: number): { year: number; month: number; day: number } {
		const year = Math.floor((30 * (jdn - this.ISLAMIC_EPOCH) + 10646) / 10631)
		const month = Math.min(
			12,
			Math.ceil((jdn - (29 + this.gregorianToJDN(year, 0, 1))) / 29.5)
		)
		const day =
			Math.floor(jdn) + 0.5 - this.gregorianToJDN(year, month - 1, 1) + 1

		return { year, month, day }
	},

	// Convert Islamic date to Julian Day Number
	islamicToJDN(year: number, month: number, day: number): number {
		return (
			day +
			Math.ceil(29.5 * (month - 1)) +
			(year - 1) * 354 +
			Math.floor((3 + 11 * year) / 30) +
			this.ISLAMIC_EPOCH -
			1
		)
	},

	getJulianDay(date: Date): number {
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()

		let a = Math.floor((14 - month) / 12)
		let y = year + 4800 - a
		let m = month + 12 * a - 3

		return (
			day +
			Math.floor((153 * m + 2) / 5) +
			365 * y +
			Math.floor(y / 4) -
			Math.floor(y / 100) +
			Math.floor(y / 400) -
			32045
		)
	},

	// Get Islamic date for a given Gregorian date
	getIslamicDate(date: Date): { year: number; month: number; day: number } {
		const jd = this.getJulianDay(date)
		const l = jd - ASTRONOMICAL.ISLAMIC_EPOCH
		const n = Math.floor((l - 1) / 10631)
		const l2 = l - 10631 * n + 354
		const j =
			Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
			Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238)
		const l3 =
			l2 -
			Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
			Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
			29
		const month = Math.floor((24 * l3) / 709)
		const day = l3 - Math.floor((709 * month) / 24)
		const year = 30 * n + j - 30

		return {
			year,
			month: month + 1,
			day
		}
	},

	// Find new moon before/after given Julian day
	findNewMoon(jdn: number, next = true): number {
		let phase = this.getLunarPhaseAngle(jdn)
		let delta = next ? 360 - phase : -phase
		const approxDays = (delta * this.LUNAR_MONTH) / 360

		let newJDN = jdn + approxDays

		// Refine the date using iteration
		for (let i = 0; i < 5; i++) {
			phase = this.getLunarPhaseAngle(newJDN)
			delta = next ? 360 - phase : -phase
			newJDN += (delta * this.LUNAR_MONTH) / 360
		}

		return Math.floor(newJDN)
	},

	getIslamicMonthStart(gregorianYear: number, islamicMonth: number): Date {
		// Approximate Islamic year
		const approxIslamicYear = Math.floor(((gregorianYear - 622) * 32) / 33)

		for (let yearAdjust = -1; yearAdjust <= 1; yearAdjust++) {
			const testYear = approxIslamicYear + yearAdjust

			// Calculate start of the year
			let jdn =
				this.ISLAMIC_EPOCH +
				Math.floor((testYear - 1) * 354.367) +
				Math.floor((islamicMonth - 1) * this.LUNAR_MONTH)

			// Find the actual new moon
			jdn = this.findNewMoon(jdn)
			const date = this.jdnToDate(jdn)

			if (date.getFullYear() === gregorianYear) {
				return date
			}
		}

		throw new Error('Month not found in specified year')
	},

	islamicToGregorian: (date: IslamicDate): GregorianDate => {
		const { year, month, day } = date
		const jdn =
			Math.floor((11 * year + 3) / 30) +
			Math.floor(354 * year) +
			Math.floor(30 * month) -
			Math.floor((month - 1) / 2) +
			day +
			1948440 -
			385
		return JDNToGregorian(jdn)
	}
}
