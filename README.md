# `extract-date-js`

## Install

```
npm install extract-date-js
```

## Usage

```js
import {extractDateFromText} from 'extract-date-js';

const text = 'The meeting is scheduled for June 5th, 2022 at 10:00 AM. The deadline for the project is March 3, 2022. The document was created on January 1, 2022 and last updated on 02/01/2022. The team will reconvene on December 20, 2022 at 5:30 PM. The next board meeting is set for 11.05.2022. Finally, the deadline for the proposal is January 20, 2022.';

const date =  extractDateFromText(text) // '2022-01-01
const date =  extractDateFromText(text, { type: 'first' }) // '2022/06/05
```

