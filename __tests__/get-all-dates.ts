import {getAllDatesFromText} from '../lib/extract-date'

const fluentTextCase =
  'The meeting is scheduled for June 5th, 2022 at 10:00 AM. The deadline for the project is March 3, 2022. The document was created on January 1, 2022 and last updated on 02/01/2022. The team will reconvene on December 20, 2022 at 5:30 PM. The next board meeting is set for 11.05.2022. Finally, the deadline for the proposal is January 20, 2022.'

const dateFormatsCase = `
DD/MM/YYYY: 07/04/2022
YYYY/MM/DD: 2022/04/07
DD-MM-YYYY: 07-04-2022
YYYY-MM-DD: 2022-04-07
DD.MM.YYYY: 07.04.2022
YYYY.MM.DD: 2022.04.07
MMM DD, YYYY: Apr 07, 2022
DD MMM YYYY: 07 Apr 2022
YYYY MMM DD: 2022 Apr 07
MMMM DD, YYYY: April 07, 2022
DD MMMM YYYY: 07 April 2022
YYYY MMMM DD: 2022 April 07
DD.MMM.YYYY: 07.Apr.2022
MMM.DD.YYYY: Apr.07.2022
YYYY.MMM.DD: 2022.Apr.07
DD MMM YY: 07 Apr 22
MMM DD YY: Apr 07 22
`

type TestCase = {
  input: string
  options?: Record<string, unknown>
  output: string[]
  only?: boolean
  skip?: boolean
}

const tests: {
  [name: string]: TestCase
} = {
  'Extracts all dates from a fluent text': {
    input: fluentTextCase,
    output: [
      '2022-06-05',
      '2022-03-03',
      '2022-01-01',
      '2022-01-02',
      '2022-12-20',
      '2022-05-11',
      '2022-01-20',
    ],
  },
  'Extracts all dates from a list of date formats': {
    input: dateFormatsCase,
    output: [
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
      '2022-04-07',
    ],
  },
}

describe('getAllDates', () => {
  for (const [name, {input, output, only, skip}] of Object.entries(tests)) {
    const testFn = skip ? test.skip : only ? test.only : test

    testFn(name, () => {
      const result = getAllDatesFromText(input)
      const parsed = result.map(date =>
        date.start.date().toISOString().slice(0, 10),
      )

      expect(parsed.toString()).toBe(output.toString())
    })
  }
})
