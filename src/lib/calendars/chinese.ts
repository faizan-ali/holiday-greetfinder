import { JDNToGregorian } from './../'

interface ChineseDate {
	year: number
	month: number
	isLeapMonth: boolean
	day: number
	stem: number // Heavenly Stem (0-9)
	branch: number // Earthly Branch (0-11)
}

const ChineseCalendarUtils = {
	// Astronomical constants
	SOLAR_YEAR: 365.242196, // Tropical year
	SYNODIC_MONTH: 29.530588, // Lunar month
	SOLAR_TERMS: 24, // Number of solar terms (jieqi)

	// Time constants
	TIMEZONE_CHINA: 8 / 24, // +8:00 UTC
	J2000: 2451545.0, // Julian date for 2000-01-01 12:00 UT

	HEAVENLY_STEMS: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
	EARTHLY_BRANCHES: [
		'子',
		'丑',
		'寅',
		'卯',
		'辰',
		'巳',
		'午',
		'未',
		'申',
		'酉',
		'戌',
		'亥'
	],
	ZODIAC_ANIMALS: [
		'Rat',
		'Ox',
		'Tiger',
		'Rabbit',
		'Dragon',
		'Snake',
		'Horse',
		'Goat',
		'Monkey',
		'Rooster',
		'Dog',
		'Pig'
	],

	calculateSolarTerm(year: number, term: number): number {
		const centuries = (year - 2000) / 100
		const T = centuries
		const T2 = T * T
		const T3 = T2 * T
		const T4 = T3 * T

		// Mean solar longitude at J2000
		const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T2

		// Sun's mean anomaly
		const M = 357.52911 + 35999.05029 * T - 0.0001537 * T2
		const Mrad = (M * Math.PI) / 180

		// Earth's orbit eccentricity
		const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T2

		// Sun's equation of center using eccentricity
		let C =
			(2 * e - (e * e * e) / 4) * Math.sin(Mrad) +
			((5 * e * e) / 4) * Math.sin(2 * Mrad) +
			((13 * e * e * e) / 12) * Math.sin(3 * Mrad)

		// Convert equation of center to degrees
		C = (C * 180) / Math.PI

		// Sun's true longitude
		const L = (L0 + C) % 360

		// Convert to JDN for the desired solar term
		const termLongitude = term * 15
		const diff = (L - termLongitude + 360) % 360
		return this.J2000 + (diff * this.SOLAR_YEAR) / 360
	},
	calculateNewMoon(jdn: number): number {
		const T = (jdn - this.J2000) / 36525
		const T2 = T * T
		const T3 = T2 * T
		const T4 = T3 * T

		// Lunar mean elongation (difference between Sun and Moon longitudes)
		let D =
			297.8501921 +
			445267.1114034 * T -
			0.0018819 * T2 +
			T3 / 545868.0 -
			T4 / 113065000.0
		D = (D * Math.PI) / 180 // Convert to radians

		// Solar mean anomaly
		let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000.0
		M = (M * Math.PI) / 180

		// Lunar mean anomaly
		let Mp =
			134.9633964 +
			477198.8675055 * T +
			0.0087414 * T2 +
			T3 / 69699.0 -
			T4 / 14712000.0
		Mp = (Mp * Math.PI) / 180

		// Moon's argument of latitude
		let F =
			93.272095 +
			483202.0175233 * T -
			0.0036539 * T2 -
			T3 / 3526000.0 +
			T4 / 863310000.0
		F = (F * Math.PI) / 180

		// Corrections for new moon, including all major periodic terms
		const dT =
			-0.4072 * Math.sin(Mp) +
			0.17241 * Math.sin(M) +
			0.01608 * Math.sin(2 * Mp) +
			0.01039 * Math.sin(2 * F) +
			0.00739 * Math.sin(Mp - M) +
			-0.00514 * Math.sin(Mp + M) +
			0.00208 * Math.sin(2 * M) +
			-0.00111 * Math.sin(Mp - 2 * F) +
			-0.00057 * Math.sin(Mp + 2 * F) +
			0.00056 * Math.sin(2 * Mp + M) +
			-0.00042 * Math.sin(3 * Mp) +
			0.00042 * Math.sin(M + 2 * F) +
			0.00038 * Math.sin(M - 2 * F) +
			-0.00024 * Math.sin(2 * Mp - M) +
			-0.00017 * Math.sin(D) + // Using D (mean elongation)
			-0.00007 * Math.sin(Mp + 2 * M) +
			0.00004 * Math.sin(2 * Mp - 2 * F) +
			0.00004 * Math.sin(3 * M) +
			0.00003 * Math.sin(Mp + M - 2 * F) +
			0.00003 * Math.sin(2 * Mp + 2 * F) +
			-0.00003 * Math.sin(Mp + M + 2 * F) +
			0.00003 * Math.sin(Mp - M + 2 * F) +
			-0.00002 * Math.sin(Mp - M - 2 * F) +
			-0.00002 * Math.sin(3 * Mp + M)

		// Convert correction from days to JDN
		return jdn + dT
	},

	// Get lunar month number and whether it's a leap month
	getLunarMonth(newMoonJdn: number): { month: number; isLeap: boolean } {
		// Calculate solar term before and after new moon
		const jdn = Math.floor(newMoonJdn)
		let prevTerm = 0
		let nextTerm = 0

		// Find surrounding solar terms
		for (let i = 0; i < this.SOLAR_TERMS; i++) {
			const term = this.calculateSolarTerm(
				2000 + (jdn - this.J2000) / 365.25,
				i
			)
			if (term <= jdn) prevTerm = i
			if (term > jdn) {
				nextTerm = i
				break
			}
		}

		const month = (Math.floor((prevTerm + 1) / 2) % 12) + 1
		const isLeap = nextTerm - prevTerm > 2

		return { month, isLeap }
	},

	// Get Chinese year number and cyclical year (stem/branch)
	getChineseYear(gregorianYear: number): {
		year: number
		stem: number
		branch: number
		zodiac: string
	} {
		const offset = gregorianYear - 1984 // 1984 was year of the Rat
		const stem = (offset + 6) % 10
		const branch = offset % 12

		return {
			year: gregorianYear - 2697, // Traditional Chinese year numbering
			stem,
			branch,
			zodiac: this.ZODIAC_ANIMALS[branch]
		}
	}
}

export const ChineseHolidays = {
	// Calculate Lunar New Year
	calculateLunarNewYear(gregorianYear: number): Date[] {
		// Lunar New Year is the second new moon after winter solstice
		const winterSolstice = ChineseCalendarUtils.calculateSolarTerm(
			gregorianYear - 1,
			22
		) // Winter solstice
		let newMoon = ChineseCalendarUtils.calculateNewMoon(winterSolstice)
		newMoon = ChineseCalendarUtils.calculateNewMoon(newMoon + 29) // Second new moon

		const jdn = Math.floor(newMoon + 0.5 + ChineseCalendarUtils.TIMEZONE_CHINA)
		const date = JDNToGregorian(jdn)

		// Return first 15 days of celebration
		const dates: Date[] = []
		for (let i = 0; i < 15; i++) {
			dates.push(new Date(date.year, date.month, date.day + i))
		}
		return dates
	},

	// Calculate Mid-Autumn Festival
	calculateMidAutumnFestival(gregorianYear: number): Date[] {
		// Mid-Autumn is on the 15th day of the 8th lunar month
		const autumnBegin = ChineseCalendarUtils.calculateSolarTerm(
			gregorianYear,
			14
		) // Start of autumn
		const newMoon = ChineseCalendarUtils.calculateNewMoon(autumnBegin)

		// Find the full moon (15th day)
		const fullMoon = newMoon + 14.5
		const jdn = Math.floor(fullMoon + 0.5 + ChineseCalendarUtils.TIMEZONE_CHINA)
		const date = JDNToGregorian(jdn)

		return [new Date(date.year, date.month, date.day)]
	},

	// Calculate Dragon Boat Festival
	calculateDragonBoatFestival(gregorianYear: number): Date[] {
		// Dragon Boat is on the 5th day of the 5th lunar month
		const summerBegin = ChineseCalendarUtils.calculateSolarTerm(
			gregorianYear,
			8
		) // Start of summer
		const newMoon = ChineseCalendarUtils.calculateNewMoon(summerBegin)

		// Find the 5th day
		const festivalDay = newMoon + 4.5
		const jdn = Math.floor(
			festivalDay + 0.5 + ChineseCalendarUtils.TIMEZONE_CHINA
		)
		const date = JDNToGregorian(jdn)

		return [new Date(date.year, date.month, date.day)]
	},

	// Calculate Qingming Festival
	calculateQingming(gregorianYear: number): Date[] {
		// Qingming is the 5th solar term
		const qingming = ChineseCalendarUtils.calculateSolarTerm(gregorianYear, 5)
		const jdn = Math.floor(qingming + 0.5 + ChineseCalendarUtils.TIMEZONE_CHINA)
		const date = JDNToGregorian(jdn)

		return [new Date(date.year, date.month, date.day)]
	}
}
