import {ExtractType, extractDateFromText} from '../lib/extract-date'

const testCase =
  'The meeting is scheduled for June 5th, 2022 at 10:00 AM. The deadline for the project is March 3, 2022. The document was created on January 1, 2022 and last updated on 02/01/2022. The team will reconvene on December 20, 2022 at 5:30 PM. The next board meeting is set for 11.05.2022. Finally, the deadline for the proposal is January 20, 2022.'

type TestCase = {
  input: string
  options?: {
    type?: ExtractType
  }
  output: string
  only?: boolean
  skip?: boolean
}

const tests: {
  [name: string]: TestCase
} = {
  'Extracts the earliest date': {
    input: testCase,
    output: '2022-01-01',
  },
  'Extracts the first date': {
    input: testCase,
    options: {
      type: 'first',
    },
    output: '2022-06-05',
  },
}

describe('extractDateFromText', () => {
  for (const [name, {input, options, output, only, skip}] of Object.entries(
    tests,
  )) {
    const testFn = skip ? test.skip : only ? test.only : test

    testFn(name, () => {
      const result = extractDateFromText(input, options)
      expect(result).toBe(output)
    })
  }
})
