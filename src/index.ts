import { holidays } from './holidays'

export interface Holiday {
	name: string
	greeting: string
	emoji: string
	isHoliday: (date: Date) => boolean
}

interface Greeting {
	greeting: string
	emoji: string
}

export const getHolidayGreeting = (date: Date): Greeting[] =>
	holidays
		.filter(holiday => holiday.isHoliday(date))
		.map(holiday => ({
			greeting: holiday.greeting,
			emoji: holiday.emoji
		}))
