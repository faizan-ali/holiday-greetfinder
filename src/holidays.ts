import type { Holiday } from './index'
import { getNthWeekday, getThanksgiving, isDateInRange, isSameDay } from './lib'
import { ChineseHolidays } from './lib/calendars/chinese'
import { ChristianHolidays } from './lib/calendars/christian'
import { JewishHolidays } from './lib/calendars/hebrew'
import { HinduHolidays } from './lib/calendars/hindu'
import { IslamicHolidays } from './lib/calendars/islamic'

const islamic = [
	{
		name: 'Eid al-Fitr',
		greeting: 'Eid Mubarak',
		emoji: '☪',
		isHoliday: (date: Date): boolean => {
			return IslamicHolidays.isEidAlFitr(date)
		}
	},
	{
		name: 'Eid al-Adha',
		greeting: 'Eid Mubarak',
		emoji: '🕌',
		isHoliday: (date: Date): boolean => {
			const eidDates = IslamicHolidays.calculateEidAlAdha(date.getFullYear())
			return eidDates.some(eidDate => isSameDay(date, eidDate))
		}
	}
]

const christian = [
	// Christian Holidays
	{
		name: 'Christmas',
		greeting: 'Merry Christmas',
		emoji: '🎅',
		isHoliday: (date: Date): boolean => {
			// Create a new Date object using UTC components to avoid timezone issues
			return (
				date.getUTCFullYear() === date.getFullYear() &&
				date.getUTCMonth() === 11 && // December
				date.getUTCDate() === 25
			)
		}
	},
	{
		name: 'Christmas Eve',
		greeting: 'Merry Christmas Eve',
		emoji: '🎄',
		isHoliday: (date: Date): boolean => {
			return (
				date.getUTCFullYear() === date.getFullYear() &&
				date.getUTCMonth() === 11 && // December
				date.getUTCDate() === 24
			)
		}
	},
	{
		name: 'Easter',
		greeting: 'Happy Easter',
		emoji: '🐰',
		isHoliday: (date: Date): boolean => {
			const easter = ChristianHolidays.calculateEaster(date.getFullYear())
			return isSameDay(date, easter)
		}
	},
	{
		name: 'Good Friday',
		greeting: 'Blessed Good Friday',
		emoji: '✝',
		isHoliday: (date: Date): boolean => {
			const easter = ChristianHolidays.calculateEaster(date.getFullYear())
			const goodFriday = new Date(easter)
			goodFriday.setDate(easter.getDate() - 2)
			return isSameDay(date, goodFriday)
		}
	}
]

const jewish = [
	{
		name: 'Rosh Hashanah',
		greeting: 'Shana Tova',
		emoji: '🍎',
		isHoliday: (date: Date): boolean => {
			const holidays = JewishHolidays.calculateRoshHashanah(date.getFullYear())
			return holidays.some(holiday => isSameDay(date, holiday))
		}
	},
	{
		name: 'Yom Kippur',
		greeting: "G'mar Chatima Tova",
		emoji: '✡',
		isHoliday: (date: Date): boolean => {
			const holidays = JewishHolidays.calculateYomKippur(date.getFullYear())
			return holidays.some(holiday => isSameDay(date, holiday))
		}
	},
	{
		name: 'Hanukkah',
		greeting: 'Happy Hanukkah',
		emoji: '🕎',
		isHoliday: (date: Date): boolean => {
			const holidays = JewishHolidays.calculateHanukkah(date.getFullYear())
			return holidays.some(holiday => isSameDay(date, holiday))
		}
	},
	{
		name: 'Passover',
		greeting: 'Chag Pesach Sameach',
		emoji: '🍷',
		isHoliday: (date: Date): boolean => {
			const holidays = JewishHolidays.calculatePassover(date.getFullYear())
			return holidays.some(holiday => isSameDay(date, holiday))
		}
	},
	{
		name: 'Shavuot',
		greeting: 'Chag Sameach',
		emoji: '📜',
		isHoliday: (date: Date): boolean => {
			const holidays = JewishHolidays.calculateShavuot(date.getFullYear())
			return holidays.some(holiday => isSameDay(date, holiday))
		}
	},
	{
		name: 'Sukkot',
		greeting: 'Chag Sameach',
		emoji: '🌿',
		isHoliday: (date: Date): boolean => {
			const holidays = JewishHolidays.calculateSukkot(date.getFullYear())
			return holidays.some(holiday => isSameDay(date, holiday))
		}
	}
]

const hindu = [
	{
		name: 'Diwali',
		greeting: 'Happy Diwali',
		emoji: '🪔',
		isHoliday: (date: Date): boolean => {
			const diwaliDates = HinduHolidays.calculateDiwali(date.getFullYear())
			return diwaliDates.some(diwaliDate => isSameDay(date, diwaliDate))
		}
	},
	{
		name: 'Holi',
		greeting: 'Happy Holi',
		emoji: '🎨',
		isHoliday: (date: Date): boolean => {
			const holiDates = HinduHolidays.calculateHoli(date.getFullYear())
			return holiDates.some(holiDate => isSameDay(date, holiDate))
		}
	},
	{
		name: 'Krishna Janmashtami',
		greeting: 'Happy Janmashtami',
		emoji: '🙏',
		isHoliday: (date: Date): boolean => {
			const janmashtamiDates = HinduHolidays.calculateJanmashtami(
				date.getFullYear()
			)
			return janmashtamiDates.some(janmashtamiDate =>
				isSameDay(date, janmashtamiDate)
			)
		}
	},
	{
		name: 'Navaratri',
		greeting: 'Happy Navaratri',
		emoji: '🪷',
		isHoliday: (date: Date): boolean => {
			const navaratriDates = HinduHolidays.calculateNavaratri(
				date.getFullYear()
			)
			return navaratriDates.some(navaratriDate =>
				isSameDay(date, navaratriDate)
			)
		}
	}
]

const chinese = [
	{
		name: 'Lunar New Year',
		greeting: '新年快乐 / 새해 복 많이 받으세요',
		emoji: '🧧',
		isHoliday: (date: Date): boolean => {
			const lunarNewYearDates = ChineseHolidays.calculateLunarNewYear(
				date.getFullYear()
			)
			return lunarNewYearDates.some(festivalDate =>
				isSameDay(date, festivalDate)
			)
		}
	},
	{
		name: 'Mid-Autumn Festival',
		greeting: '中秋节快乐 / 추석 잘 보내세요',
		emoji: '🥮',
		isHoliday: (date: Date): boolean => {
			const midAutumnDates = ChineseHolidays.calculateMidAutumnFestival(
				date.getFullYear()
			)
			return midAutumnDates.some(festivalDate => isSameDay(date, festivalDate))
		}
	},
	{
		name: 'Dragon Boat Festival',
		greeting: '端午节快乐',
		emoji: '🛶',
		isHoliday: (date: Date): boolean => {
			const dragonBoatDates = ChineseHolidays.calculateDragonBoatFestival(
				date.getFullYear()
			)
			return dragonBoatDates.some(festivalDate => isSameDay(date, festivalDate))
		}
	},
	{
		name: 'Qingming Festival',
		greeting: '清明节安康',
		emoji: '🌿',
		isHoliday: (date: Date): boolean => {
			const qingmingDates = ChineseHolidays.calculateQingming(
				date.getFullYear()
			)
			return qingmingDates.some(festivalDate => isSameDay(date, festivalDate))
		}
	}
]

export const holidays: Holiday[] = [
	...christian,
	...islamic,
	...jewish,
	...chinese,
	// Fixed date celebrations
	{
		name: 'New Year',
		greeting: 'Happy New Year',
		emoji: '🎆',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 0 && date.getDate() === 1
		}
	},
	{
		name: "New Year's Day",
		greeting: 'Happy New Year',
		emoji: '🎆',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 0 && date.getDate() === 1
		}
	},
	{
		name: 'Lunar New Year',
		greeting: 'Happy Lunar New Year',
		emoji: '🧧',
		isHoliday: (date: Date): boolean => {
			// Simplified check - falls between Jan 21 and Feb 20
			const month = date.getMonth()
			const day = date.getDate()
			return (month === 0 && day >= 21) || (month === 1 && day <= 20)
		}
	},

	// Global Celebrations
	{
		name: "Valentine's Day",
		greeting: "Happy Valentine's Day",
		emoji: '❤',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 1 && date.getDate() === 14
		}
	},
	{
		name: 'Halloween',
		greeting: 'Happy Halloween',
		emoji: '🎃',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 9 && date.getDate() === 31
		}
	},
	{
		name: "Mother's Day",
		greeting: "Happy Mother's Day",
		emoji: '💐',
		isHoliday: (date: Date): boolean => {
			// Second Sunday in May in many countries
			if (date.getMonth() === 4) {
				return isSameDay(date, getNthWeekday(date, 2, 0))
			}
			return false
		}
	},
	{
		name: "Father's Day",
		greeting: "Happy Father's Day",
		emoji: '👔',
		isHoliday: (date: Date): boolean => {
			// Third Sunday in June in many countries
			if (date.getMonth() === 5) {
				return isSameDay(date, getNthWeekday(date, 3, 0))
			}
			return false
		}
	},
	{
		name: "International Women's Day",
		greeting: "Happy International Women's Day",
		emoji: '👩',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 2 && date.getDate() === 8
		}
	},
	{
		name: 'World Pride Day',
		greeting: 'Happy Pride',
		emoji: '🏳',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 5 && date.getDate() === 28
		}
	},
	{
		name: 'Earth Day',
		greeting: 'Happy Earth Day',
		emoji: '🌍',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 3 && date.getDate() === 22
		}
	},
	{
		name: 'International Labor Day',
		greeting: 'Happy Labor Day',
		emoji: '👷',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 4 && date.getDate() === 1
		}
	},
	{
		name: 'United Nations Day',
		greeting: 'Happy UN Day',
		emoji: '🌐',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 9 && date.getDate() === 24
		}
	},
	{
		name: 'Human Rights Day',
		greeting: 'Happy Human Rights Day',
		emoji: '✊',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 11 && date.getDate() === 10
		}
	},

	// North American Holidays
	{
		name: 'US Independence Day',
		greeting: 'Happy Fourth of July',
		emoji: '🇺',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 6 && date.getDate() === 4
		}
	},
	{
		name: 'US Thanksgiving',
		greeting: 'Happy Thanksgiving',
		emoji: '🦃',
		isHoliday: (date: Date): boolean => {
			const thanksgiving = getThanksgiving(date, true)
			return isSameDay(date, thanksgiving)
		}
	},
	{
		name: 'Canadian Thanksgiving',
		greeting: 'Happy Thanksgiving',
		emoji: '🍁',
		isHoliday: (date: Date): boolean => {
			const thanksgiving = getThanksgiving(date, false)
			return isSameDay(date, thanksgiving)
		}
	},
	{
		name: 'Cinco de Mayo',
		greeting: '¡Feliz Cinco de Mayo!',
		emoji: '🇲',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 4 && date.getDate() === 5
		}
	},

	// European Holidays
	{
		name: 'Oktoberfest',
		greeting: 'Prost!',
		emoji: '🍺',
		isHoliday: (date: Date): boolean => {
			// Mid-September to first Sunday in October
			return isDateInRange(date, 8, 16, 9, 7)
		}
	},
	{
		name: 'Bastille Day',
		greeting: 'Joyeux 14 Juillet',
		emoji: '🇫',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 6 && date.getDate() === 14
		}
	},
	{
		name: "St. Patrick's Day",
		greeting: "Happy St. Patrick's Day",
		emoji: '☘',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 2 && date.getDate() === 17
		}
	},
	{
		name: 'Guy Fawkes Night',
		greeting: 'Happy Bonfire Night',
		emoji: '🎆',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 10 && date.getDate() === 5
		}
	},

	// Asian Holidays
	{
		name: 'Korean Seollal',
		greeting: '새해 복 많이 받으세요',
		emoji: '🇰',
		isHoliday: (date: Date): boolean => {
			// Coincides with Lunar New Year
			return isDateInRange(date, 0, 21, 1, 20)
		}
	},
	{
		name: 'Vesak',
		greeting: 'Happy Vesak Day',
		emoji: '🙏',
		isHoliday: (date: Date): boolean => {
			// Usually May full moon
			return isDateInRange(date, 4, 5, 4, 15)
		}
	},

	// Middle Eastern Holidays
	{
		name: 'Nowruz',
		greeting: 'Nowruz Mobrook!',
		emoji: '🌱',
		isHoliday: (date: Date): boolean => {
			// March 19-21
			return (
				date.getMonth() === 2 && date.getDate() >= 19 && date.getDate() <= 21
			)
		}
	},

	// African Holidays
	{
		name: 'Africa Day',
		greeting: 'Happy Africa Day',
		emoji: '🌍',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 4 && date.getDate() === 25
		}
	},
	{
		name: 'South African Heritage Day',
		greeting: 'Happy Heritage Day',
		emoji: '🇿',
		isHoliday: (date: Date): boolean => {
			return date.getMonth() === 8 && date.getDate() === 24
		}
	},

	// Latin American Holidays
	{
		name: 'Día de los Muertos',
		greeting: '¡Feliz Día de los Muertos!',
		emoji: '💀',
		isHoliday: (date: Date): boolean => {
			return (
				date.getMonth() === 10 && (date.getDate() === 1 || date.getDate() === 2)
			)
		}
	},
	{
		name: 'Brazilian Carnival',
		greeting: 'Feliz Carnaval',
		emoji: '🎭',
		isHoliday: (date: Date): boolean => {
			// Simplified check - Carnival is 47 days before Easter
			const easter = ChristianHolidays.calculateEaster(date.getFullYear())
			const carnival = new Date(easter)
			carnival.setDate(easter.getDate() - 47)
			const carnivalEnd = new Date(carnival)
			carnivalEnd.setDate(carnival.getDate() + 5)
			return date >= carnival && date <= carnivalEnd
		}
	},

	// Caribbean Holidays
	{
		name: 'Junkanoo',
		greeting: 'Happy Junkanoo',
		emoji: '🎊',
		isHoliday: (date: Date): boolean => {
			// December 26 and January 1
			return (
				(date.getMonth() === 11 && date.getDate() === 26) ||
				(date.getMonth() === 0 && date.getDate() === 1)
			)
		}
	}
]

holidays.forEach(h => console.log(h.name))
