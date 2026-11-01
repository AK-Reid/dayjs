import MockDate from 'mockdate'
import dayjs from '../../src'
import isLeapYear from '../../src/plugin/isLeapYear'

dayjs.extend(isLeapYear)

beforeEach(() => {
  MockDate.set(new Date())
})

afterEach(() => {
  MockDate.reset()
})

it('IsLeapYear', () => {
  expect(dayjs('20000101').isLeapYear()).toBe(true)
  expect(dayjs('2100-01-01').isLeapYear()).toBe(false)
})

it('ordinary years are not leap years', () => {
  ['2019-01-01', '2021-01-01', '2023-01-01'].forEach((date) => {
    expect(dayjs(date).isLeapYear()).toBe(false)
  })
})

it('non-century years divisible by four are leap years', () => {
  ['2020-01-01', '2024-01-01', '2028-01-01'].forEach((date) => {
    expect(dayjs(date).isLeapYear()).toBe(true)
  })
})

it('century years not divisible by four hundred are not leap years', () => {
  ['1900-01-01', '2100-01-01', '2200-01-01'].forEach((date) => {
    expect(dayjs(date).isLeapYear()).toBe(false)
  })
})

it('century years divisible by four hundred are leap years', () => {
  ['1600-01-01', '2000-01-01', '2400-01-01'].forEach((date) => {
    expect(dayjs(date).isLeapYear()).toBe(true)
  })
})
