import { JDNToGregorian, gregorianToJDN } from './../'

interface VedicTime {
	year: number // Samvat year
	month: number // 1-12
	paksha: 'Shukla' | 'Krishna' // Bright/Dark half
	tithi: number // 1-15
	nakshatra: number // 1-27
}

// Astronomical constants and calculations
const HinduCalendarUtils = {
	// Ayanamsa (precession of equinoxes) calculation
	// Using Lahiri ayanamsa, most widely used in India
	AYANAMSA_BASE: 23.85, // For 2000 CE
	AYANAMSA_YEARLY_MOTION: 0.000238,

	calculateAyanamsa(gregorianYear: number): number {
		return (
			this.AYANAMSA_BASE + this.AYANAMSA_YEARLY_MOTION * (gregorianYear - 2000)
		)
	},

	// Solar month calculations
	SOLAR_YEAR: 365.25636,
	SOLAR_MONTH: 365.25636 / 12,

	// Lunar constants
	SYNODIC_MONTH: 29.530588, // Length of lunar month
	TITHI_LENGTH: 29.530588 / 30, // Length of one tithi

	// Stellar day (with respect to fixed stars)
	SIDEREAL_YEAR: 365.256363004,

	// Calculate Julian centuries since J2000.0
	getJulianCenturies(jdn: number): number {
		return (jdn - 2451545.0) / 36525
	},

	// Calculate sun's mean longitude
	getSunMeanLongitude(T: number): number {
		return (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360
	},

	// Calculate sun's mean anomaly
	getSunMeanAnomaly(T: number): number {
		return 357.52911 + 35999.05029 * T - 0.0001537 * T * T
	},

	// Calculate sun's equation of center
	getSunEquationOfCenter(T: number, M: number): number {
		const Mrad = (M * Math.PI) / 180
		return (
			Math.sin(Mrad) * (1.914602 - 0.004817 * T - 0.000014 * T * T) +
			Math.sin(2 * Mrad) * (0.019993 - 0.000101 * T) +
			Math.sin(3 * Mrad) * 0.000289
		)
	},

	// Calculate sun's true longitude
	getSunTrueLongitude(T: number): number {
		const L0 = this.getSunMeanLongitude(T)
		const M = this.getSunMeanAnomaly(T)
		const C = this.getSunEquationOfCenter(T, M)
		return (L0 + C) % 360
	},

	// Calculate moon's mean longitude
	getMoonMeanLongitude(T: number): number {
		return (
			(218.3164477 +
				481267.88123421 * T -
				0.0015786 * T * T +
				(T * T * T) / 538841 -
				(T * T * T * T) / 65194000) %
			360
		)
	},

	// Calculate moon's mean elongation
	getMoonMeanElongation(T: number): number {
		return (
			(297.8501921 +
				445267.1114034 * T -
				0.0018819 * T * T +
				(T * T * T) / 545868 -
				(T * T * T * T) / 113065000) %
			360
		)
	},

	// Calculate lunar phase angle
	getLunarPhaseAngle(jdn: number): number {
		const T = this.getJulianCenturies(jdn)
		const D = this.getMoonMeanElongation(T)
		return D % 360
	},

	// Calculate tithi (lunar day)
	getTithi(jdn: number): number {
		const phaseAngle = this.getLunarPhaseAngle(jdn)
		return Math.floor(phaseAngle / 12) + 1
	},

	// Calculate paksha (lunar fortnight)
	getPaksha(tithi: number): 'Shukla' | 'Krishna' {
		return tithi <= 15 ? 'Shukla' : 'Krishna'
	},

	// Calculate nakshatra (lunar mansion)
	getNakshatra(jdn: number): number {
		const T = this.getJulianCenturies(jdn)
		const L = this.getMoonMeanLongitude(T)
		const ayanamsa = this.calculateAyanamsa(2000 + T * 100)
		const siderealLong = (L - ayanamsa + 360) % 360
		return Math.floor((siderealLong * 27) / 360) + 1
	}
}

export const HinduHolidays = {
	// Calculate Diwali
	calculateDiwali(gregorianYear: number): Date[] {
		// Diwali is on Amavasya (new moon) of Kartika month
		const dates: Date[] = []
		const jdn = gregorianToJDN({
			year: gregorianYear,
			month: 9, // October
			day: 15
		})

		// Search for Amavasya (new moon)
		for (let i = -15; i <= 15; i++) {
			const currentJdn = jdn + i
			const tithi = HinduCalendarUtils.getTithi(currentJdn)
			if (tithi === 30) {
				const date = JDNToGregorian(currentJdn)
				dates.push(new Date(date.year, date.month, date.day))
				break
			}
		}

		return dates
	},

	// Calculate Holi
	calculateHoli(gregorianYear: number): Date[] {
		// Holi is on Purnima (full moon) of Phalguna month
		const dates: Date[] = []
		const jdn = gregorianToJDN({
			year: gregorianYear,
			month: 2, // March
			day: 1
		})

		// Search for Purnima (full moon)
		for (let i = -15; i <= 15; i++) {
			const currentJdn = jdn + i
			const tithi = HinduCalendarUtils.getTithi(currentJdn)
			if (tithi === 15) {
				const date = JDNToGregorian(currentJdn)
				// Holi is celebrated on the next day
				dates.push(new Date(date.year, date.month, date.day + 1))
				break
			}
		}

		return dates
	},

	// Calculate Krishna Janmashtami
	calculateJanmashtami(gregorianYear: number): Date[] {
		// Krishna Janmashtami is on Krishna Paksha Ashtami in Bhadrapada
		const dates: Date[] = []
		const jdn = gregorianToJDN({
			year: gregorianYear,
			month: 7, // August
			day: 15
		})

		// Search for Krishna Paksha Ashtami
		for (let i = -15; i <= 15; i++) {
			const currentJdn = jdn + i
			const tithi = HinduCalendarUtils.getTithi(currentJdn)
			const paksha = HinduCalendarUtils.getPaksha(tithi)
			if (paksha === 'Krishna' && tithi === 8) {
				const date = JDNToGregorian(currentJdn)
				dates.push(new Date(date.year, date.month, date.day))
				break
			}
		}

		return dates
	},

	// Calculate Navaratri
	calculateNavaratri(gregorianYear: number): Date[] {
		// Navaratri starts on Pratipada (first day) of Ashwin Shukla Paksha
		const dates: Date[] = []
		const jdn = gregorianToJDN({
			year: gregorianYear,
			month: 8, // September
			day: 15
		})

		// Find the start of Navaratri
		for (let i = -15; i <= 15; i++) {
			const currentJdn = jdn + i
			const tithi = HinduCalendarUtils.getTithi(currentJdn)
			const paksha = HinduCalendarUtils.getPaksha(tithi)
			if (paksha === 'Shukla' && tithi === 1) {
				// Add all 9 days
				for (let day = 0; day < 9; day++) {
					const date = JDNToGregorian(currentJdn + day)
					dates.push(new Date(date.year, date.month, date.day))
				}
				break
			}
		}

		return dates
	}
}
