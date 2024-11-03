# Holiday Checker
Ever wanted to show a greeting for a major holiday in your app without manually writing it out? This library has you covered!

Example usage:
```typescript
getHolidayGreeting('2024-10-31', 'Asia/Tokyo')      => Happy Diwali 🪔
getHolidayGreeting('2024-06-16', 'America/New_York') => Eid Mubarak 🌙
```

This is a simple library for checking cultural and religious holidays worldwide. This package supports both checking specific holidays and getting holiday greetings based on dates.

There are no external dependencies and no reliance on an API. 

**Note:** This will work until 2028, I will likely update the data way before that :) I tried to write logic to compute these dates but that got very complex. Sometimes hardcoding is best!

## Installation

```bash
npm install holiday-greetfinder
```

## Features

- Check for specific holidays using boolean functions
- Get holiday greetings for any given date
- Timezone support for accurate holiday checking globally
- Support for fixed date holidays and variable date holidays
- Coverage for major cultural and religious celebrations


## Holidays
You can determine the following holidays (and show these greetings for them!)
Merry Christmas
Happy Christmas Eve
Eid Mubarak
Happy Hanukkah
Chag Pesach Sameach
Shana Tova
Happy Diwali
Happy Easter
Happy Earth Day
Happy Valentine's Day
Happy Halloween
Happy New Year
Happy Thanksgiving
Happy Father's Day
Happy Mother's Day
Happy US Independence Day
Happy St. Patrick's Day
¡Feliz Cinco de Mayo!
Happy Africa Day
Happy Pride
Happy Holi
G'mar Chatima Tova
Happy Canadian Thanksgiving
Happy Lunar New Year
Happy Carnival
Happy Junkanoo
Happy Nowruz
Happy Vesak
¡Feliz Día de los Muertos!
Prost Oktoberfest!


## Usage

### Boolean Holiday Functions

Each holiday has its own boolean function that returns true if the given date matches the holiday:

```typescript
import { 
  isChristmas,
  isDiwali,
  isEidMubarak,
  isHanukkah
  // ... other holiday functions
} from 'holiday-checker';

// Check if a date is Christmas
isChristmas('2024-12-25') // true
isChristmas('2024-12-24') // false

// Check if a date is Diwali
isDiwali('2024-10-31') // true
isDiwali('2024-10-30') // false

// Check with timezone
isEidMubarak('2024-04-10', 'Asia/Dubai') // true
isHanukkah('2024-12-25', 'America/New_York') // true
```

### Available Holiday Functions

```typescript
isChristmas(date: string, timezone?: string): boolean
isChristmasEve(date: string, timezone?: string): boolean
isEidMubarak(date: string, timezone?: string): boolean
isHanukkah(date: string, timezone?: string): boolean
isPassover(date: string, timezone?: string): boolean
isRoshHashanah(date: string, timezone?: string): boolean
isDiwali(date: string, timezone?: string): boolean
isEaster(date: string, timezone?: string): boolean
isEarthDay(date: string, timezone?: string): boolean
isValentinesDay(date: string, timezone?: string): boolean
isHalloween(date: string, timezone?: string): boolean
isNewYear(date: string, timezone?: string): boolean
isThanksgiving(date: string, timezone?: string): boolean
isFathersDay(date: string, timezone?: string): boolean
isMothersDay(date: string, timezone?: string): boolean
isIndependenceDay(date: string, timezone?: string): boolean
isStPatricksDay(date: string, timezone?: string): boolean
isCincoDeMayo(date: string, timezone?: string): boolean
isAfricaDay(date: string, timezone?: string): boolean
isHoli(date: string, timezone?: string): boolean
isYomKippur(date: string, timezone?: string): boolean
isCanadianThanksgiving(date: string, timezone?: string): boolean
isLunarNewYear(date: string, timezone?: string): boolean
isCarnival(date: string, timezone?: string): boolean
isJunkanoo(date: string, timezone?: string): boolean
isNowruz(date: string, timezone?: string): boolean
isVesak(date: string, timezone?: string): boolean
isDiaDeLosMuertos(date: string, timezone?: string): boolean
isOktoberfest(date: string, timezone?: string): boolean
```

### Holiday Greeting Function

The `getHolidayGreeting` function returns an array of holiday greetings for a given date:

```typescript
import { getHolidayGreeting } from 'holiday-checker';

// Get holidays for a specific date
const holidays = getHolidayGreeting('2024-12-25');
console.log(holidays);
// [
//   { greeting: "Merry Christmas", emoji: "🎄" },
//   { greeting: "Happy Hanukkah", emoji: "🕎" }  // When holidays overlap
// ]

// Get holidays for a date with no celebrations
const noHolidays = getHolidayGreeting('2024-03-15');
console.log(noHolidays); // []
```

### Timezone Support

All functions support an optional timezone parameter using IANA timezone identifiers. You should provide these for the best result:

```typescript
// Check Diwali in different timezones
isDiwali('2024-10-31', 'Asia/Kolkata')    // true
isDiwali('2024-10-31', 'America/New_York') // true

// Get holiday greetings for different timezones
getHolidayGreeting('2024-10-31', 'Asia/Tokyo')      => Happy Diwali 🪔
getHolidayGreeting('2024-06-16', 'America/New_York') => Eid Mubarak 🌙

// Examples of supported timezones:
// - 'America/New_York'
// - 'America/Los_Angeles'
// - 'Europe/London'
// - 'Asia/Tokyo'
// - 'Asia/Kolkata'
// - 'Australia/Sydney'
// etc.
```

## Data Coverage

- Fixed dates are supported indefinitely
- Variable dates (religious/lunar holidays) are supported from 2024 to 2031
- All dates are based on official calendars and recognized observances

## Notes

1. Date strings should be in 'YYYY-MM-DD' format
2. Timezone support uses IANA timezone identifiers
3. Some holidays may span multiple days
4. Religious holidays may vary by region and observation

## Known Limitations

1. Variable date holidays are only supported until 2028
2. Some regional variations of holidays might not be included
3. Local government-specific holidays are not included

## License

MIT