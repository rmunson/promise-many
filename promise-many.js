;(function(define){
    'use strict'
    define(function(require, exports, module){
        var toArray = Array.from ? Array.from : (function(){
            var slice = Array.prototype.slice;
            return function(convert){
                return slice.call(convert,0);
            }
        })();
        var CATCH = "catch";
        var _resolve;
        var _reject;

        function executor(resolve, reject){
            _resolve=resolve;
            _reject=reject;
        }

        function resolveFor(promise){         
            return Promise.resolve(promise)[CATCH](this);
        }

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
            ).then(function(values){
                (isRejected ? finalReject : finalResolve)(values);
            });
            return finalPromise;
        }
    });
})(typeof module === 'object' && module.exports && typeof define !== 'function'
    ? function (factory) { module.exports = factory(require, module.exports, module); }
    : define
);
