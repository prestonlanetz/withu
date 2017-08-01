# nd-datetime

[![Travis](https://img.shields.io/travis/ndfront/nd-datetime.svg?style=flat-square)](https://github.com/ndfront/nd-datetime)
[![Coveralls](https://img.shields.io/coveralls/ndfront/nd-datetime.svg?style=flat-square)](https://github.com/ndfront/nd-datetime)
[![NPM version](https://img.shields.io/npm/v/nd-datetime.svg?style=flat-square)](https://npmjs.org/package/nd-datetime)

> 简单的时间日期转换库

## 安装

```bash
$ npm install nd-datetime --save
```

## 使用

```js
var datetime = require('nd-datetime');
// use datetime
console.log(datetime().format())
console.log(datetime(1444553026337).format())
console.log(datetime(1444553026337).format('yyyy-MM-dd hh:mm:ss.ii'))
// see more examples in tests/
```
