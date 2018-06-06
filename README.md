# promise-many

Given a collection of promises and/or values, defer resolution and rejection until all promises
in the collection have resolved or rejected.  Finally, resolve or reject with an `Array` of all values
gathered.

---
## Example
```js
    promiseMany([1,2,3, Promise.resolve(4)])
    //    => resolved with [1,2,3,4]

    promiseMany([1,2,3, Promise.reject(4)])
    //    => rejected with [1,2,3,4]

    var rejectedEventually = new Promise(function(_resolve, _reject){
        setTimeout(function(){
            _reject(3);
        }, 200);
    });
    promiseMany([1,2,rejectedEventually, Promise.resolve(4)])
    //    => rejected with [1,2,3,4]
```
