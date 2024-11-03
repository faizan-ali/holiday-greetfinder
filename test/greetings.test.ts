import assert from 'node:assert/strict'
import test from 'node:test'
import { getHolidayGreeting } from '../src'

// Helper function to check if a holiday is included in results
const includesHoliday = (holidays, expectedHoliday) => {
	return holidays.some(
		holiday =>
			holiday.greeting === expectedHoliday.greeting &&
			holiday.emoji === expectedHoliday.emoji
	)
}

// Test data structure for timezone variations
const timezones = {
	westCoast: { zone: 'America/Los_Angeles', offset: '-08:00' },
	eastCoast: { zone: 'America/New_York', offset: '-05:00' },
	london: { zone: 'Europe/London', offset: '+00:00' },
	jerusalem: { zone: 'Asia/Jerusalem', offset: '+02:00' },
	dubai: { zone: 'Asia/Dubai', offset: '+04:00' },
	singapore: { zone: 'Asia/Singapore', offset: '+08:00' },
	tokyo: { zone: 'Asia/Tokyo', offset: '+09:00' }
}

test('Fixed Date Holidays', async t => {
	// Helper to test a fixed date holiday across years and timezones
	const testFixedHoliday = async (name, month, day, greeting, emoji) => {
		await t.test(name, async t => {
			const years = [2024, 2025, 2031] // Current, next, and future year

			for (const year of years) {
				for (const [zoneName, { zone, offset }] of Object.entries(timezones)) {
					await t.test(`${year} in ${zoneName}`, () => {
						const date = new Date(
							`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00${offset}`
						)
						const results = getHolidayGreeting(date, zone)

						assert.ok(
							includesHoliday(results, { greeting, emoji }),
							`${name} not found for ${date.toISOString()} in ${zone}`
						)
					})
				}
			}
		})
	}

	// Test all fixed date holidays
	await testFixedHoliday("New Year's Day", 1, 1, 'Happy New Year', '🎊')
	await testFixedHoliday("Valentine's Day", 2, 14, "Happy Valentine's Day", '❤')
	await testFixedHoliday(
		"St. Patrick's Day",
		3,
		17,
		"Happy St. Patrick's Day",
		'☘'
	)
	await testFixedHoliday('Earth Day', 4, 22, 'Happy Earth Day', '🌍')
	await testFixedHoliday('Cinco de Mayo', 5, 5, '¡Feliz Cinco de Mayo!', '🇲')
	await testFixedHoliday(
		'US Independence Day',
		7,
		4,
		'Happy US Independence Day',
		'🇺'
	)
	await testFixedHoliday('Halloween', 10, 31, 'Happy Halloween', '🎃')
	await testFixedHoliday('Christmas Eve', 12, 24, 'Happy Christmas Eve', '🎄')
	await testFixedHoliday('Christmas Day', 12, 25, 'Merry Christmas', '🎄')
})

test('Lunar Calendar Holidays', async t => {
	const lunarHolidays = [
		{
			name: 'Lunar New Year',
			dates: {
				2024: '02-10',
				2025: '01-29',
				2031: '01-23'
			},
			greeting: 'Happy Lunar New Year',
			emoji: '🧧'
		}
	]

	for (const holiday of lunarHolidays) {
		await t.test(holiday.name, async t => {
			for (const [year, date] of Object.entries(holiday.dates)) {
				for (const [zoneName, { zone, offset }] of Object.entries(timezones)) {
					await t.test(`${year} in ${zoneName}`, () => {
						const testDate = new Date(`${year}-${date}T00:00:00${offset}`)
						const results = getHolidayGreeting(testDate, zone)

						assert.ok(
							includesHoliday(results, {
								greeting: holiday.greeting,
								emoji: holiday.emoji
							}),
							`${holiday.name} not found for ${testDate.toISOString()} in ${zone}`
						)
					})
				}
			}
		})
	}
})

test('Islamic Holidays', async t => {
	const islamicHolidays = [
		{
			name: 'Eid al-Fitr',
			dates: {
				2024: ['04-09', '04-10', '04-11'],
				2025: ['03-29', '03-30', '03-31'],
				2031: ['02-21', '02-22', '02-23']
			},
			greeting: 'Eid Mubarak',
			emoji: '☪'
		},
		{
			name: 'Eid al-Adha',
			dates: {
				2024: ['06-15', '06-16', '06-17'],
				2025: ['06-05', '06-06', '06-07'],
				2031: ['03-31', '04-01', '04-02']
			},
			greeting: 'Eid Mubarak',
			emoji: '☪'
		}
	]

	const testTimezones = {
		jerusalem: { zone: 'Asia/Jerusalem', offset: '+02:00' },
		newYork: { zone: 'America/New_York', offset: '-04:00' }
	}

	for (const holiday of islamicHolidays) {
		await t.test(holiday.name, async t => {
			for (const [year, dates] of Object.entries(holiday.dates)) {
				for (const date of dates) {
					for (const [zoneName, { zone, offset }] of Object.entries(
						testTimezones
					)) {
						await t.test(`${year} ${date} in ${zoneName}`, () => {
							const baseDate = `${year}-${date}T12:00:00${offset}`
							const testDate = new Date(baseDate)

							// For New York, also check the previous day
							if (zone === 'America/New_York') {
								const prevDate = new Date(testDate)
								prevDate.setDate(prevDate.getDate() - 1)
								const nextDate = new Date(testDate)
								nextDate.setDate(nextDate.getDate() + 1)

								const results = [
									...getHolidayGreeting(prevDate, zone),
									...getHolidayGreeting(testDate, zone),
									...getHolidayGreeting(nextDate, zone)
								]

								assert.ok(
									includesHoliday(results, {
										greeting: holiday.greeting,
										emoji: holiday.emoji
									}),
									`${holiday.name} not found for ${testDate.toISOString()} (or adjacent days) in ${zone}`
								)
							} else {
								// For other timezones, just check the exact date
								const results = getHolidayGreeting(testDate, zone)
								assert.ok(
									includesHoliday(results, {
										greeting: holiday.greeting,
										emoji: holiday.emoji
									}),
									`${holiday.name} not found for ${testDate.toISOString()} in ${zone}`
								)
							}
						})
					}
				}
			}
		})
	}
})

test('Jewish Holidays', async t => {
	const jewishHolidays = [
		{
			name: 'Rosh Hashanah',
			dates: {
				2024: ['10-02', '10-03', '10-04'],
				2025: ['09-22', '09-23', '09-24'],
				2031: ['09-17', '09-18', '09-19']
			},
			greeting: 'Shana Tova',
			emoji: '🍎'
		},
		{
			name: 'Yom Kippur',
			dates: {
				2024: ['10-11', '10-12'],
				2025: ['10-01', '10-02'],
				2031: ['09-26', '09-27']
			},
			greeting: "G'mar Chatima Tova",
			emoji: '✡'
		},
		{
			name: 'Hanukkah',
			dates: {
				2024: ['12-25', '12-26', '12-27', '12-28', '12-29', '12-30', '12-31'],
				2025: [
					'12-13',
					'12-14',
					'12-15',
					'12-16',
					'12-17',
					'12-18',
					'12-19',
					'12-20'
				],
				2031: [
					'12-09',
					'12-10',
					'12-11',
					'12-12',
					'12-13',
					'12-14',
					'12-15',
					'12-16'
				]
			},
			greeting: 'Happy Hanukkah',
			emoji: '🕎'
		},
		{
			name: 'Passover',
			dates: {
				2024: ['04-22', '04-23', '04-28', '04-29'],
				2025: ['04-12', '04-13', '04-18', '04-19'],
				2031: ['04-08', '04-09', '04-14', '04-15']
			},
			greeting: 'Chag Pesach Sameach',
			emoji: '🍷'
		}
	]

	const testTimezones = {
		jerusalem: { zone: 'Asia/Jerusalem', offset: '+02:00' },
		newYork: { zone: 'America/New_York', offset: '-04:00' }
	}

	for (const holiday of jewishHolidays) {
		await t.test(holiday.name, async t => {
			for (const [year, dates] of Object.entries(holiday.dates)) {
				for (const date of dates) {
					for (const [zoneName, { zone, offset }] of Object.entries(
						testTimezones
					)) {
						await t.test(`${year} ${date} in ${zoneName}`, () => {
							const baseDate = `${year}-${date}T12:00:00${offset}`
							const testDate = new Date(baseDate)

							// For New York, check adjacent days as well
							if (zone === 'America/New_York') {
								const prevDate = new Date(testDate)
								prevDate.setDate(prevDate.getDate() - 1)
								const nextDate = new Date(testDate)
								nextDate.setDate(nextDate.getDate() + 1)

								const results = [
									...getHolidayGreeting(prevDate, zone),
									...getHolidayGreeting(testDate, zone),
									...getHolidayGreeting(nextDate, zone)
								]

								assert.ok(
									includesHoliday(results, {
										greeting: holiday.greeting,
										emoji: holiday.emoji
									}),
									`${holiday.name} not found for ${testDate.toISOString()} (or adjacent days) in ${zone}`
								)
							} else {
								// For other timezones, just check the exact date
								const results = getHolidayGreeting(testDate, zone)
								assert.ok(
									includesHoliday(results, {
										greeting: holiday.greeting,
										emoji: holiday.emoji
									}),
									`${holiday.name} not found for ${testDate.toISOString()} in ${zone}`
								)
							}
						})
					}
				}
			}
		})
	}
})

test('Calculated North American Holidays', async t => {
	const calculatedHolidays = [
		{
			name: "Mother's Day",
			dates: {
				2024: '05-12',
				2025: '05-11'
			},
			greeting: "Happy Mother's Day",
			emoji: '💐'
		},
		{
			name: "Father's Day",
			dates: {
				2024: '06-16',
				2025: '06-15'
			},
			greeting: "Happy Father's Day",
			emoji: '👔'
		},
		{
			name: 'US Thanksgiving',
			dates: {
				2024: '11-28',
				2025: '11-27'
			},
			greeting: 'Happy Thanksgiving',
			emoji: '🦃'
		},
		{
			name: 'Canadian Thanksgiving',
			dates: {
				2024: '10-14',
				2025: '10-13'
			},
			greeting: 'Happy Canadian Thanksgiving',
			emoji: '🇨'
		}
	]

	for (const holiday of calculatedHolidays) {
		await t.test(holiday.name, async t => {
			for (const [year, date] of Object.entries(holiday.dates)) {
				if (holiday.name === 'Canadian Thanksgiving') {
					await t.test(`${year} ${date} in Toronto`, () => {
						const baseDate = new Date(`${year}-${date}T12:00:00-04:00`)
						// Check the day before, day of, and day after
						const prevDate = new Date(baseDate)
						prevDate.setDate(prevDate.getDate() - 1)
						const nextDate = new Date(baseDate)
						nextDate.setDate(nextDate.getDate() + 1)

						const results = [
							...getHolidayGreeting(prevDate, 'America/Toronto'),
							...getHolidayGreeting(baseDate, 'America/Toronto'),
							...getHolidayGreeting(nextDate, 'America/Toronto')
						]

						assert.ok(
							includesHoliday(results, {
								greeting: holiday.greeting,
								emoji: holiday.emoji
							}),
							`${holiday.name} not found for ${baseDate.toISOString()} (or adjacent days) in America/Toronto`
						)
					})
				} else {
					// For US holidays, test both coasts
					for (const [zoneName, { zone, offset }] of Object.entries({
						newYork: { zone: 'America/New_York', offset: '-04:00' },
						losAngeles: { zone: 'America/Los_Angeles', offset: '-07:00' }
					})) {
						await t.test(`${year} ${date} in ${zoneName}`, () => {
							const baseDate = new Date(`${year}-${date}T12:00:00${offset}`)
							// Check the day before, day of, and day after
							const prevDate = new Date(baseDate)
							prevDate.setDate(prevDate.getDate() - 1)
							const nextDate = new Date(baseDate)
							nextDate.setDate(nextDate.getDate() + 1)

							const results = [
								...getHolidayGreeting(prevDate, zone),
								...getHolidayGreeting(baseDate, zone),
								...getHolidayGreeting(nextDate, zone)
							]

							assert.ok(
								includesHoliday(results, {
									greeting: holiday.greeting,
									emoji: holiday.emoji
								}),
								`${holiday.name} not found for ${baseDate.toISOString()} (or adjacent days) in ${zone}`
							)
						})
					}
				}
			}
		})
	}
})

test('International Cultural Festivals', async t => {
	const culturalFestivals = [
		{
			name: 'Carnival',
			dates: {
				2024: ['02-09', '02-10', '02-11'],
				2025: ['02-28', '03-01', '03-02']
			},
			greeting: 'Happy Carnival',
			emoji: '🎭'
		},
		{
			name: 'Oktoberfest',
			dates: {
				// Fixed dates for Oktoberfest - matches the holiday database
				2024: ['09-21', '09-22', '09-23', '09-24'],
				2025: ['09-21', '09-22', '09-23', '09-24'],
				2031: ['09-21', '09-22', '09-23', '09-24']
			},
			greeting: 'Prost Oktoberfest!',
			emoji: '🍺'
		},
		{
			name: 'Día de los Muertos',
			dates: {
				2024: ['11-01', '11-02'],
				2025: ['11-01', '11-02'],
				2031: ['11-01', '11-02']
			},
			greeting: '¡Feliz Día de los Muertos!',
			emoji: '💀'
		}
	]

	const testTimezones = {
		riodejaneiro: { zone: 'America/Sao_Paulo', offset: '-03:00' },
		mexico: { zone: 'America/Mexico_City', offset: '-06:00' },
		berlin: { zone: 'Europe/Berlin', offset: '+01:00' }
	}

	for (const festival of culturalFestivals) {
		await t.test(festival.name, async t => {
			for (const [year, dates] of Object.entries(festival.dates)) {
				for (const date of dates) {
					for (const [zoneName, { zone, offset }] of Object.entries(
						testTimezones
					)) {
						await t.test(`${year} ${date} in ${zoneName}`, () => {
							const testDate = new Date(`${year}-${date}T12:00:00${offset}`)
							const results = getHolidayGreeting(testDate, zone)

							assert.ok(
								includesHoliday(results, {
									greeting: festival.greeting,
									emoji: festival.emoji
								}),
								`${festival.name} not found for ${testDate.toISOString()} in ${zone}`
							)
						})
					}
				}
			}
		})
	}
})

test('Fixed Date International Holidays', async t => {
	const fixedHolidays = [
		{
			name: "Valentine's Day",
			dates: { month: 2, day: 14 },
			greeting: "Happy Valentine's Day",
			emoji: '❤'
		},
		{
			name: "St. Patrick's Day",
			dates: { month: 3, day: 17 },
			greeting: "Happy St. Patrick's Day",
			emoji: '☘'
		},
		{
			name: 'Earth Day',
			dates: { month: 4, day: 22 },
			greeting: 'Happy Earth Day',
			emoji: '🌍'
		}
	]

	const testTimezones = {
		utc: { zone: 'UTC', offset: '+00:00' },
		newYork: { zone: 'America/New_York', offset: '-04:00' },
		tokyo: { zone: 'Asia/Tokyo', offset: '+09:00' }
	}

	const years = [2024, 2025, 2031]

	for (const holiday of fixedHolidays) {
		await t.test(holiday.name, async t => {
			for (const year of years) {
				for (const [zoneName, { zone, offset }] of Object.entries(
					testTimezones
				)) {
					await t.test(`${year} in ${zoneName}`, () => {
						const date = `${year}-${String(holiday.dates.month).padStart(2, '0')}-${String(holiday.dates.day).padStart(2, '0')}`
						const testDate = new Date(`${date}T12:00:00${offset}`)
						const results = getHolidayGreeting(testDate, zone)

						assert.ok(
							includesHoliday(results, {
								greeting: holiday.greeting,
								emoji: holiday.emoji
							}),
							`${holiday.name} not found for ${testDate.toISOString()} in ${zone}`
						)
					})
				}
			}
		})
	}
})

test('Indian Festivals', async t => {
	const indianFestivals = [
		{
			name: 'Diwali',
			dates: {
				2024: ['10-31', '11-01'], // Including both days
				2025: ['10-20', '10-21'],
				2026: ['11-08', '11-09'],
				2027: ['10-29', '10-30'],
				2028: ['10-17', '10-18']
			},
			greeting: 'Happy Diwali',
			emoji: '🪔'
		},
		{
			name: 'Holi',
			dates: {
				2024: ['03-24', '03-25'], // Including Holika Dahan and Holi
				2025: ['03-13', '03-14'],
				2026: ['03-03', '03-04'],
				2027: ['03-21', '03-22'],
				2028: ['03-10', '03-11']
			},
			greeting: 'Happy Holi',
			emoji: '🎨'
		}
	]

	// Test in relevant timezones
	const testTimezones = {
		delhi: { zone: 'Asia/Kolkata', offset: '+05:30' },
		mumbai: { zone: 'Asia/Kolkata', offset: '+05:30' },
		singapore: { zone: 'Asia/Singapore', offset: '+08:00' }, // Large Indian diaspora
		london: { zone: 'Europe/London', offset: '+00:00' }, // Large Indian diaspora
		newYork: { zone: 'America/New_York', offset: '-04:00' } // Large Indian diaspora
	}

	await t.test('Testing Indian festivals', async t => {
		for (const festival of indianFestivals) {
			await t.test(festival.name, async t => {
				for (const [year, dates] of Object.entries(festival.dates)) {
					for (const date of dates) {
						for (const [zoneName, { zone, offset }] of Object.entries(
							testTimezones
						)) {
							await t.test(`${year}-${date} in ${zoneName}`, async () => {
								// Test the day itself and adjacent days to account for timezone differences
								const baseDate = new Date(`${year}-${date}T12:00:00${offset}`)
								const prevDate = new Date(baseDate)
								prevDate.setDate(prevDate.getDate() - 1)
								const nextDate = new Date(baseDate)
								nextDate.setDate(nextDate.getDate() + 1)

								// Get greetings for all three days
								const results = [
									...getHolidayGreeting(prevDate, zone),
									...getHolidayGreeting(baseDate, zone),
									...getHolidayGreeting(nextDate, zone)
								]

								// Construct error message with detailed information
								const errorMsg = `${festival.name} not found for ${baseDate.toISOString()} in ${zone}\n
									Checked dates:
									- Previous: ${prevDate.toISOString()}
									Target: ${baseDate.toISOString()}
									Next: ${nextDate.toISOString()}
									Got results: ${JSON.stringify(results, null, 2)}`

								assert.ok(
									includesHoliday(results, {
										greeting: festival.greeting,
										emoji: festival.emoji
									}),
									errorMsg
								)
							})
						}
					}
				}
			})
		}
	})
})
