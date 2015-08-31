# mongoose-link [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Link related documents from a mongoose query.

This module was created in lieu of being able to populate documents 
in mongoose in a way that is not dependant on `_id`.


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
then(link(User, 'created_by:user')).
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
