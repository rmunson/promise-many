(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else{
        root.promiseMany = factory();
    }
})(function () {
    'use strict'
    var toArray = Array.from ? Array.from : (function(){
        var slice = Array.prototype.slice;
        return function(convert){
            return slice.call(convert,0);
        }
    })();
    var CATCH = 'catch';
    var _resolve;
    var _reject;

    function executor(resolve, reject){
        _resolve=resolve;
        _reject=reject;
    }

    function resolveFor(promise){
        // We should only need to catch errors/rejections.
        // Values and resolves should pass-through without incident.
        return Promise.resolve(promise)[CATCH](this);
    }
    /**
     * Given a collection of promises and/or values,
     * defer resolution and rejection until all promises
     * in the collection have resolved or rejected.
     *
     * @example
     *     promiseMany([1,2,3, Promise.resolve(4)])
     *     => resolved with [1,2,3,4]
     *
     *     promiseMany([1,2,Promise.reject(3), Promise.resolve(4)])
     *     => rejected with [1,2,3,4]
     * @param  {mixed} many Array or array-like collection of promises and/or values
     * @return {array}      Array of all resulting resolve values and reject reasons.
     */
    return function(many){
        var finalPromise = new Promise(executor);
        var finalResolve = _resolve;
        var finalReject = _reject;
        var isRejected = false;

        Promise.all(
            toArray(many).map(resolveFor, function delayRejection(val){
                isRejected = true;
                return val;
            })
        ).then(function finalizePromise(values){
            (isRejected ? finalReject : finalResolve)(values);
        });
        return finalPromise;
    }
});
