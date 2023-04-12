import * as chrono from 'chrono-node'
import {ParsingContext} from 'chrono-node/dist/esm/chrono'

function createDateParser() {
  const parser = chrono.en.GB.clone()

  function certainYearRefiner(
    _: ParsingContext,
    results: chrono.ParsingResult[],
  ) {
    // If there is no AM/PM (meridiem) specified,
    //  let all time between 1:00 - 4:00 be PM (13.00 - 16.00)
    const filteredResults: chrono.ParsingResult[] = []
    results.forEach(result => {
      if (
        result.start.isCertain('day') &&
        result.start.isCertain('month') &&
        result.start.isCertain('year') &&
        // Weird bug in chrono 2016-06-18
        result.start.get('day') !== 0
      ) {
        filteredResults.push(result)
      }
    })

    return filteredResults
  }

  parser.refiners.push({
    refine: certainYearRefiner,
  })

  return parser
}

function monthNameRegexp() {
  return (
    'Jan(?:uary|\\.)?|Feb(?:ruary|\\.)?|Mar(?:ch|\\.)?|Apr(?:il|\\.)?|May|Jun(?:e|\\.)?|Jul(?:y|\\.)?|Aug(?:ust|\\.)?|Sep(?:tember|\\.)?|Oct(?:ober|\\.)?|Nov(?:ember|\\.)?|Dec(?:ember|\\.)?' +
    '|' +
    'Ene(?:ro|\\.)?|Feb(?:rero|\\.)?|Mar(?:zo|\\.)?|Abr(?:il|\\.)?|May(?:o|\\.)?|Jun(?:io|\\.)?|Jul(?:io|\\.)?|Ago(?:sto|\\.)?|Sep(?:tiembre|\\.)?|Oct(?:ubre|\\.)?|Nov(?:iembre|\\.)?|Dic(?:iembre|\\.)?'
  )
}

function prepareText(text: string) {
  return (
    text
      // Incorrectly scanned hyphens
      .replace(/[\u2013\u2014\u2012\uFE58/]{1}/gi, '-')
      // Incorrectly scanned dd/mm/yyyy date, e.g. dd\'mm\'yyyy
      // Example: 01\'01\'2016 -> 01/01/2016
      .replace(
        new RegExp(
          '(^|\\s)' +
            // (d)d?(?)
            '(?:([0-3]{0,1}[0-9]{1})[^a-z0-9]{1,2})' +
            // (m)m?(?)
            '(?:([0-3]{0,1}[0-9]{1})[^a-z0-9]{1,2})' +
            // yyyy
            '([1-9]{1}[0-9]{3})' +
            '(?=$|\\s)',
          'ig',
        ),
        '$1$2/$3/$4',
      )
      // Incorrect format MMM dd yyyy
      // Example: Jan01 2016 -> Jan 01 2016
      .replace(
        new RegExp(
          `(^|\\s)` +
            // monthname?
            `(?:(${monthNameRegexp()})[^a-z0-9]{0,2})` +
            // (d)d?(?)
            `(?:(` +
            `[0-3]{0,1}[0-9]{1}` +
            `)[^a-z0-9]{1,2})` +
            // yyyy
            `([1-9]{1}[0-9]{3})` +
            `(?=$|\\s)`,
          'ig',
        ),
        '$1$2 $3 $4',
      )
      // Incorrect format dd MMM yyyy
      // Example: 01Jan 2016 -> 01 Jan 2016
      .replace(
        new RegExp(
          `(^|\\s)` +
            // (d)d?(?)
            `(?:(` +
            `[0-3]{0,1}[0-9]{1}` +
            `)[^a-z0-9]{1,2})` +
            // monthname?
            `(?:(${monthNameRegexp()})[^a-z0-9]{1,2})` +
            // yyyy
            `([1-9]{1}[0-9]{3})` +
            `(?=$|\\s)`,
          'ig',
        ),
        '$1$2 $3 $4',
      )
      // Incorrectly scanned ..Thh;ii;ss
      // Example: T12;45;59 -> T12:45:59
      .replace(
        new RegExp(
          // Thh
          'T([0-1][0-9]|2[0-4])' +
            // seperator
            '[^a-z0-9]{1}' +
            // ii
            '([0-5][0-9])' +
            // seperator
            '[^a-z0-9]{1}' +
            // ss
            '([0-5][0-9])' +
            '(?=$|\\s)',
          'ig',
        ),
        'T$1:$2:$3',
      )
  )
}

function extractEarliest(values: chrono.ParsedResult[]) {
  let minFound: Date | undefined

  values.forEach(value => {
    if (!minFound || value.start.date() < minFound) {
      minFound = value.start.date()
    }
  })

  return minFound
}

function extractFirst(values: chrono.ParsedResult[]) {
  if (values.length > 0) {
    return values[0].start.date()
  }
}

type ExtractType = 'earliest' | 'first'

function extractDateFromText(text: string, options?: {type?: ExtractType}) {
  const {type = 'earliest'} = options ?? {}
  const preparedText = prepareText(text)
  const dates = getAllDatesFromText(preparedText)

  let result: Date | undefined

  if (type === 'earliest') {
    result = extractEarliest(dates)
  } else {
    result = extractFirst(dates)
  }

  if (!result) {
    return null
  }

  return result.toISOString().slice(0, 10)
}

function getAllDatesFromText(text: string) {
  return createDateParser().parse(text)
}

export {extractDateFromText, getAllDatesFromText, type ExtractType}
