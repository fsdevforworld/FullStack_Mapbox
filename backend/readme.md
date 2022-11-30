## environment

nodejs > v14.0

#### Using node.js with an Express NPM component as the backend API framework, create a single API endpoint which will generate a number of randomly located geometry coordinates within a given boundary box and return coordinates as an array of lat/long dictionaries or named arrays.

## guide

1. server start command `npm start`
2. server test command `npm test`

## node pacakge install

`npm install`

## endpoints

`/api/coordinate?longitude1=${region[0][0]}&latitude1=${region[0][1]}&longitude2=${region[1][0]}&latitude2=${region[1][1]}`
`/api/getregion`
