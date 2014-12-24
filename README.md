fist-fistlabs_unit_asker [![Build Status](https://travis-ci.org/fistlabs/fist-fistlabs_unit_asker.svg)](https://travis-ci.org/fistlabs/fist-fistlabs_unit_asker)
========================

Fist plugin which provides the unit to create http requests with [asker](https://www.npmjs.com/package/asker)

Unit ```_fistlabs_unit_asker``` inherits from [```_fistlabs_unit_serial```](https://www.npmjs.com/package/fist-fistlabs_unit_serial), expresses any http request in 5 steps:

* ```options``` - creating request options 
* ```prepare``` - prepare request options
* ```request``` - do request
* ```compile``` - parse response
* ```resolve``` - check, validate response, then return result

#Usage:

```
$ npm i fist-fistlabs_unit_asker
```

```js
app.install('fist-fislabs_unit_asker');
app.unit({
    base: '_fistlabs_unit_asker',
    name: 'news.posts',
    options: function (track, context) {
        return {
            //  any options supported by asker
            host: 'backend.example.com',
            port: 3000,
            path: '/get-news/'
        };
    },
    resolve: function (track, context) {
        var newsList = context.prev;
        return newsList.filter(function (item) {
            return item.hidden !== true;
        });
    }
});
```

#Tips and tricks:
By default ```prepare``` step supports path factories as paths.

```js
app.unit({
    base: '_fistlabs_unit_asker',
    name: 'news.post',
    options: function (track, context) {
        return {
            host: 'backend.example.com',
            port: 3000,
            path: {
                build: function (vars) {
                    return util.format('/news/post/%s/', vars.postId)
                }
            },
            vars: {
                postId: context.p('postId')
            }
        };
    }
});
```

So you can use finger routes to create paths easier:
```js
var Rule = require('finger/core/rule');

var postPath = new Rule('/news/post/<postId>/');

app.unit({
    base: '_fistlabs_unit_asker',
    name: 'news.post',
    options: function (track, context) {
        return {
            host: 'backend.example.com',
            port: 3000,
            path: postPath,
            vars: {
                postId: context.p('postId')
            }
        };
    }
});
```

---------
LICENSE [MIT](LICENSE)
