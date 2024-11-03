import assert from 'node:assert/strict'
import test from 'node:test'
import {
	isCarnival,
	isChristmas,
	isChristmasEve,
	isCincoDeMayo,
	isDiaDeLosMuertos,
	isDiwali,
	isEarthDay,
	isEaster,
	isEidMubarak,
	isHalloween,
	isHanukkah,
	isHoli,
	isIndependenceDay,
	isLunarNewYear,
	isOktoberfest,
	isPassover,
	isRoshHashanah,
	isStPatricksDay,
	isValentinesDay,
	isYomKippur
} from '../src'

test('Holiday Checker Tests', async t => {
	// First, test some fixed date holidays that won't change
	await t.test('Fixed Date Holidays', async t => {
		const fixedTests = [
			{ fn: isChristmas, date: '2024-12-25' },
			{ fn: isChristmasEve, date: '2024-12-24' },
			{ fn: isValentinesDay, date: '2024-02-14' },
			{ fn: isHalloween, date: '2024-10-31' },
			{ fn: isIndependenceDay, date: '2024-07-04' },
			{ fn: isStPatricksDay, date: '2024-03-17' },
			{ fn: isCincoDeMayo, date: '2024-05-05' },
			{ fn: isEarthDay, date: '2024-04-22' }
		]

		for (const { fn, date } of fixedTests) {
			await t.test(`${fn.name} should be true on ${date}`, () => {
				assert.equal(fn(date), true, `${fn.name} failed for ${date}`)
			})

			await t.test(`${fn.name} should be false on wrong date`, () => {
				const wrongDate = '2024-01-01' // A date we know isn't any of these holidays
				assert.equal(
					fn(wrongDate),
					false,
					`${fn.name} incorrectly returned true for ${wrongDate}`
				)
			})
		}
	})

	// Test lunar/religious holidays for specific years we know
	await t.test('Lunar and Religious Holidays 2024', async t => {
		const lunarTests2024 = [
			{ fn: isEidMubarak, date: '2024-04-10' },
			{ fn: isHanukkah, date: '2024-12-25' },
			{ fn: isPassover, date: '2024-04-22' },
			{ fn: isRoshHashanah, date: '2024-10-02' },
			{ fn: isDiwali, date: '2024-10-31' },
			{ fn: isEaster, date: '2024-03-31' },
			{ fn: isHoli, date: '2024-03-25' },
			{ fn: isYomKippur, date: '2024-10-11' },
			{ fn: isLunarNewYear, date: '2024-02-10' }
		]

		for (const { fn, date } of lunarTests2024) {
			await t.test(`${fn.name} should be true on ${date}`, () => {
				assert.equal(fn(date), true, `${fn.name} failed for ${date}`)
			})
		}
	})

	// Test multi-day festivals
	await t.test('Multi-day Festivals', async t => {
		const festivalTests = [
			{ fn: isOktoberfest, date: '2024-09-21' },
			{ fn: isDiaDeLosMuertos, date: '2024-11-01' },
			{ fn: isCarnival, date: '2024-02-10' }
		]

		for (const { fn, date } of festivalTests) {
			await t.test(`${fn.name} should be true on ${date}`, () => {
				assert.equal(fn(date), true, `${fn.name} failed for ${date}`)
			})
		}
	})

	// Test timezone handling
	await t.test('Timezone Handling', async t => {
		const timezoneTests = [
			{
				fn: isDiwali,
				date: '2024-10-31',
				timezone: 'Asia/Kolkata'
			},
			{
				fn: isLunarNewYear,
				date: '2024-02-10',
				timezone: 'Asia/Shanghai'
			}
		]

		for (const { fn, date, timezone } of timezoneTests) {
			await t.test(`${fn.name} should handle timezone ${timezone}`, () => {
				assert.equal(
					fn(date, timezone),
					true,
					`${fn.name} failed for ${date} in ${timezone}`
				)
			})
		}
	})

	// Test year variations
	await t.test('Different Years', async t => {
		const yearTests = [
			{ fn: isEaster, dates: ['2024-03-31', '2025-04-20'] },
			{ fn: isDiwali, dates: ['2024-10-31', '2025-10-20'] }
		]

		for (const { fn, dates } of yearTests) {
			for (const date of dates) {
				await t.test(`${fn.name} should work for ${date}`, () => {
					assert.equal(fn(date), true, `${fn.name} failed for ${date}`)
				})
			}
		}
	})

	// Test invalid dates
	await t.test('Invalid Dates', async t => {
		const invalidTests = [
			{ fn: isDiwali, date: '2023-10-31' }, // Before our data range
			{ fn: isHoli, date: '2040-10-31' } // After our data range
		]

		for (const { fn, date } of invalidTests) {
			await t.test(`${fn.name} should handle invalid date ${date}`, () => {
				assert.equal(
					fn(date),
					false,
					`${fn.name} should return false for ${date}`
				)
			})
		}
	})
})
