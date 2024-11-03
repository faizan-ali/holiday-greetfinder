// test/holidayGreetings.test.ts

import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { getHolidayGreeting } from '../src'

// Verified dates for tests
const VERIFIED_RAMADAN_DATES = {
	2020: {
		start: '2020-04-24',
		end: '2020-05-23'
	},
	2024: {
		start: '2024-03-11',
		end: '2024-04-09'
	},
	2030: {
		start: '2030-01-07',
		end: '2030-02-05'
	}
}

describe.only('getHolidayGreeting', () => {
	// Fixed Date Holidays
	describe('Fixed Date Holidays', () => {
		test('past - should return Christmas greeting (2020)', () => {
			const result = getHolidayGreeting(new Date('2020-12-25'))
			assert.deepEqual(result[0], {
				greeting: 'Merry Christmas',
				emoji: '🎅'
			})
		})

		test('present - should return Christmas greeting (2024)', () => {
			const result = getHolidayGreeting(new Date('2024-12-25'))
			assert.deepEqual(result[0], {
				greeting: 'Merry Christmas',
				emoji: '🎅'
			})
		})

		test('future - should return Christmas greeting (2030)', () => {
			const result = getHolidayGreeting(new Date('2030-12-25'))
			assert.deepEqual(result[0], {
				greeting: 'Merry Christmas',
				emoji: '🎅'
			})
		})
	})

	// Islamic Calendar Holidays
	describe('Islamic Calendar Holidays', () => {
		// Eid al-Fitr tests
		test('past - should return Eid al-Fitr greeting (2020)', () => {
			const result = getHolidayGreeting(new Date('2020-05-24'))
			assert.deepEqual(result[0], {
				greeting: 'Eid Mubarak',
				emoji: '☪'
			})
		})

		test('present - should return Eid al-Fitr greeting (2024)', () => {
			const result = getHolidayGreeting(new Date('2024-04-10'))
			assert.deepEqual(result[0], {
				greeting: 'Eid Mubarak',
				emoji: '☪'
			})
		})

		test('future - should return Eid al-Fitr greeting (2029)', () => {
			const result = getHolidayGreeting(new Date('2029-02-14'))
			assert.deepEqual(result[0], {
				greeting: 'Eid Mubarak',
				emoji: '☪'
			})
		})
	})

	// Hebrew Calendar Holidays
	describe('Hebrew Calendar Holidays', () => {
		// Hanukkah tests
		test('past - should return Hanukkah greeting (2020)', () => {
			const result = getHolidayGreeting(new Date('2020-12-10'))
			assert.deepEqual(result[0], {
				greeting: 'Happy Hanukkah',
				emoji: '🕎'
			})
		})

		test('present - should return Hanukkah greeting (2024)', () => {
			const result = getHolidayGreeting(new Date('2024-12-25'))
			assert.deepEqual(result[0], {
				greeting: 'Happy Hanukkah',
				emoji: '🕎'
			})
		})

		test('future - should return Hanukkah greeting (2030)', () => {
			const result = getHolidayGreeting(new Date('2030-12-15'))
			assert.deepEqual(result[0], {
				greeting: 'Happy Hanukkah',
				emoji: '🕎'
			})
		})

		// Passover tests
		test('past - should return Passover greeting (2020)', () => {
			const result = getHolidayGreeting(new Date('2020-04-08'))
			assert.deepEqual(result[0], {
				greeting: 'Chag Pesach Sameach',
				emoji: '🍷'
			})
		})

		test('present - should return Passover greeting (2024)', () => {
			const result = getHolidayGreeting(new Date('2024-04-22'))
			assert.deepEqual(result[0], {
				greeting: 'Chag Pesach Sameach',
				emoji: '🍷'
			})
		})

		test('future - should return Passover greeting (2030)', () => {
			const result = getHolidayGreeting(new Date('2030-04-18'))
			assert.deepEqual(result[0], {
				greeting: 'Chag Pesach Sameach',
				emoji: '🍷'
			})
		})
	})
	//
	// // Hindu Calendar Holidays
	// describe('Hindu Calendar Holidays', () => {
	// 	// Diwali tests
	// 	test('past - should return Diwali greeting (2020)', () => {
	// 		const result = getHolidayGreeting(new Date('2020-11-14'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Diwali',
	// 			emoji: '🪔'
	// 		})
	// 	})
	//
	// 	test('present - should return Diwali greeting (2024)', () => {
	// 		const result = getHolidayGreeting(new Date('2024-10-31'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Diwali',
	// 			emoji: '🪔'
	// 		})
	// 	})
	//
	// 	test('future - should return Diwali greeting (2030)', () => {
	// 		const result = getHolidayGreeting(new Date('2030-10-27'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Diwali',
	// 			emoji: '🪔'
	// 		})
	// 	})
	//
	// 	// Holi tests
	// 	test('past - should return Holi greeting (2020)', () => {
	// 		const result = getHolidayGreeting(new Date('2020-03-10'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Holi',
	// 			emoji: '🎨'
	// 		})
	// 	})
	//
	// 	test('present - should return Holi greeting (2024)', () => {
	// 		const result = getHolidayGreeting(new Date('2024-03-25'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Holi',
	// 			emoji: '🎨'
	// 		})
	// 	})
	//
	// 	test('future - should return Holi greeting (2030)', () => {
	// 		const result = getHolidayGreeting(new Date('2030-03-13'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Holi',
	// 			emoji: '🎨'
	// 		})
	// 	})
	// })
	//
	// // Chinese Calendar Holidays
	// describe('Chinese Calendar Holidays', () => {
	// 	// Lunar New Year tests
	// 	test('past - should return Lunar New Year greeting (2020)', () => {
	// 		const result = getHolidayGreeting(new Date('2020-01-25'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: '新年快乐 / 새해 복 많이 받으세요',
	// 			emoji: '🧧'
	// 		})
	// 	})
	//
	// 	test('present - should return Lunar New Year greeting (2024)', () => {
	// 		const result = getHolidayGreeting(new Date('2024-02-10'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: '新年快乐 / 새해 복 많이 받으세요',
	// 			emoji: '🧧'
	// 		})
	// 	})
	//
	// 	test('future - should return Lunar New Year greeting (2030)', () => {
	// 		const result = getHolidayGreeting(new Date('2030-02-03'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: '新年快乐 / 새해 복 많이 받으세요',
	// 			emoji: '🧧'
	// 		})
	// 	})
	//
	// 	// Mid-Autumn Festival tests
	// 	test('past - should return Mid-Autumn Festival greeting (2020)', () => {
	// 		const result = getHolidayGreeting(new Date('2020-10-01'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: '中秋节快乐 / 추석 잘 보내세요',
	// 			emoji: '🥮'
	// 		})
	// 	})
	//
	// 	test('present - should return Mid-Autumn Festival greeting (2024)', () => {
	// 		const result = getHolidayGreeting(new Date('2024-09-17'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: '中秋节快乐 / 추석 잘 보내세요',
	// 			emoji: '🥮'
	// 		})
	// 	})
	//
	// 	test('future - should return Mid-Autumn Festival greeting (2030)', () => {
	// 		const result = getHolidayGreeting(new Date('2030-09-13'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: '中秋节快乐 / 추석 잘 보내세요',
	// 			emoji: '🥮'
	// 		})
	// 	})
	// })
	//
	// // Buddhist Calendar Holidays
	// describe('Buddhist Calendar Holidays', () => {
	// 	// Vesak tests
	// 	test('past - should return Vesak greeting (2020)', () => {
	// 		const result = getHolidayGreeting(new Date('2020-05-07'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Vesak Day',
	// 			emoji: '🙏'
	// 		})
	// 	})
	//
	// 	test('present - should return Vesak greeting (2024)', () => {
	// 		const result = getHolidayGreeting(new Date('2024-05-23'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Vesak Day',
	// 			emoji: '🙏'
	// 		})
	// 	})
	//
	// 	test('future - should return Vesak greeting (2030)', () => {
	// 		const result = getHolidayGreeting(new Date('2030-05-15'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Vesak Day',
	// 			emoji: '🙏'
	// 		})
	// 	})
	//
	// 	// Asalha Puja tests
	// 	test('past - should return Asalha Puja greeting (2020)', () => {
	// 		const result = getHolidayGreeting(new Date('2020-07-05'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Asalha Puja Day',
	// 			emoji: '🕉'
	// 		})
	// 	})
	//
	// 	test('present - should return Asalha Puja greeting (2024)', () => {
	// 		const result = getHolidayGreeting(new Date('2024-07-21'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Asalha Puja Day',
	// 			emoji: '🕉'
	// 		})
	// 	})
	//
	// 	test('future - should return Asalha Puja greeting (2030)', () => {
	// 		const result = getHolidayGreeting(new Date('2030-07-12'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy Asalha Puja Day',
	// 			emoji: '🕉'
	// 		})
	// 	})
	// })
	//
	// // Edge Cases and Special Scenarios
	// describe('Edge Cases', () => {
	// 	test('should return null for non-holiday date', () => {
	// 		const result = getHolidayGreeting(new Date('2024-03-15'))
	// 		assert.equal(result, null)
	// 	})
	//
	// 	test('should handle leap years correctly in past', () => {
	// 		const result = getHolidayGreeting(new Date('2020-02-29'))
	// 		assert.equal(result, null)
	// 	})
	//
	// 	test('should handle leap years correctly in future', () => {
	// 		const result = getHolidayGreeting(new Date('2028-02-29'))
	// 		assert.equal(result, null)
	// 	})
	//
	// 	test('should handle year boundaries - past', () => {
	// 		const result = getHolidayGreeting(new Date('2020-12-31'))
	// 		assert.equal(result, null)
	// 	})
	//
	// 	test('should handle year boundaries - future', () => {
	// 		const result = getHolidayGreeting(new Date('2030-01-01'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Happy New Year',
	// 			emoji: '🎆'
	// 		})
	// 	})
	//
	// 	test('should handle invalid dates', () => {
	// 		const result = getHolidayGreeting(new Date('invalid'))
	// 		assert.equal(result, null)
	// 	})
	// })
	//
	// // Multiple Holidays on Same Day
	// describe('Multiple Holidays', () => {
	// 	test('past - should handle overlapping holidays (2020)', () => {
	// 		const result = getHolidayGreeting(new Date('2020-12-11')) // If any overlapping holidays
	// 		// Verify based on your priority implementation
	// 		assert.ok(result?.[0]?.greeting)
	// 		assert.ok(result?.[0]?.emoji)
	// 	})
	//
	// 	test('present - should handle overlapping holidays (2024)', () => {
	// 		const result = getHolidayGreeting(new Date('2024-12-25')) // Christmas and Hanukkah overlap
	// 		// Assuming Christmas takes priority
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Merry Christmas',
	// 			emoji: '🎅'
	// 		})
	// 	})
	//
	// 	test('future - should handle overlapping holidays (2030)', () => {
	// 		const result = getHolidayGreeting(new Date('2030-12-25'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Merry Christmas',
	// 			emoji: '🎅'
	// 		})
	// 	})
	// })
	//
	// // Far Future Dates
	// describe('Far Future Dates', () => {
	// 	test('should calculate fixed holidays correctly for year 2050', () => {
	// 		const result = getHolidayGreeting(new Date('2050-12-25'))
	// 		assert.deepEqual(result[0], {
	// 			greeting: 'Merry Christmas',
	// 			emoji: '🎅'
	// 		})
	// 	})
	//
	// 	test('should calculate lunar holidays correctly for year 2050', () => {
	// 		// Example with Chinese New Year - exact date would need verification
	// 		const result = getHolidayGreeting(new Date('2050-02-16'))
	// 		assert.ok(result?.[0]?.greeting.includes('新年快乐'))
	// 	})
	//
	// 	test('should calculate solar-lunar holidays correctly for year 2050', () => {
	// 		// Example with Diwali - exact date would need verification
	// 		const result = getHolidayGreeting(new Date('2050-11-07'))
	// 		assert.ok(result?.[0]?.greeting.includes('Diwali'))
	// 	})
	// })
})
