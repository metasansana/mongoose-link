# mongoose-link [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Link related documents from a mongoose query.

This module provides an alternative way to populate
related (linked) documents from a mongoose query.

It does not depend on `_id`.

## Install

```sh
$ npm install --save mongoose-link
```


## Usage

```js
var link = require('mongoose-link');
var Comment = require('./Comment');
var User = require('./User');

Comment.
find().
lean().
exec().
then(link.sync(User, 'created_by:user',{email:true}, {lean:true})).
then(function(comments) {  
  //Comments should look like {_id:'5325245af32e34634363', user:{email:'x@x.com'}}
})

```

## License

Apache-2.0 © [Lasana Murray](http://quenk.com)

[npm-image]: https://badge.fury.io/js/mongoose-link.svg
[npm-url]: https://npmjs.org/package/mongoose-link
[travis-image]: https://travis-ci.org/metasansana/mongoose-link.svg?branch=master
[travis-url]: https://travis-ci.org/metasansana/mongoose-link
[daviddm-image]: https://david-dm.org/metasansana/mongoose-link.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/metasansana/mongoose-link
