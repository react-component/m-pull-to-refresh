# rmc-pull-to-refresh
---

React Mobile PullToRefresh Component.


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rmc-pull-to-refresh.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-pull-to-refresh
[travis-image]: https://img.shields.io/travis/react-component/m-pull-to-refresh.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-pull-to-refresh
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-pull-to-refresh.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-pull-to-refresh?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/m-pull-to-refresh.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/m-pull-to-refresh
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rmc-pull-to-refresh.svg?style=flat-square
[download-url]: https://npmjs.org/package/rmc-pull-to-refresh


## Screenshots

<img src="https://os.alipayobjects.com/rmsportal/rcLuiqtnDULPyzG.gif" width="288"/>


## Development

```
npm install
npm start
```

## Example

http://localhost:8899/examples/

online example: http://react-component.github.io/m-pull-to-refresh/


## install

[![rmc-pull-to-refresh](https://nodei.co/npm/rmc-pull-to-refresh.png)](https://npmjs.org/package/rmc-pull-to-refresh)


## Usage

see example

## API

for details see: https://github.com/apeatling/web-pull-to-refresh

### props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
| className | additional css class of root dom node | String |  |
| prefixCls | prefix class | String | 'rmc-pull-to-refresh' |
| contentClassName | contentClassName | String | - |
| contentStyle | contentStyle | object | - |
| icon   | arrow element   | React element |  - |
| loading   | loading element   | React element |  - |
| distanceToRefresh   |   distanceToRefresh    | number |    70  |
| resistance   |    resistance  | number |    2.5  |
| loadingFunction   |  return a promise   | function, required |  -  |
| hammerOptions   |  be used to configure the [Hammer manager](http://hammerjs.github.io/api/). These properties will be merged with the default ones.(ref: [react-hammerjs](https://github.com/JedWatson/react-hammerjs))   | object |  -  |


## Test Case

```
npm test
npm run chrome-test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

rmc-pull-to-refresh is released under the MIT license.
