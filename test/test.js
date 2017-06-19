;(function(define){
    'use strict'
    define(function(require,exports,module){
        var chai = require("chai/chai");
        var promiseMany = require("../promise-many");
        var expect=chai.expect;

        window.promiseMany = promiseMany;

        describe("promise-many",function(){
            it("should return a promise",function(){
                expect(promiseMany([1,2,3])).to.be.an.instanceOf(Promise);
            });
            it("should accept any array-like object",function(done){
                var testObjects = [
                    promiseMany([1,2,3]).then(function(result){
                        expect(result).to.have.members([1,2,3])
                        return result;
                    }),
                    promiseMany({ 0 : 1, 1 : 2, 2 : 3, length : 3}).then(function(result){
                        expect(result).to.have.members([1,2,3])
                        return result;
                    })
                ];
                Promise.all(testObjects).then(function(){
                    done();
                },function(huh){
                    throw new Error(huh);
                    done();
                });
            });
            it("should resolve if all promises resolved",function(done){
                promiseMany([1,2,new Promise(function(resolve,reject){
                    setTimeout(function(){resolve(3)},20)
                })]).then(function(result){
                    expect(result).to.be.ok;
                    expect(result.length).to.equal(3);
                    expect(result).to.have.members([1,2,3])
                    done();
                },function(){
                    throw new Error("Nope");
                    done();
                });
            });
            it("should reject if one or more promises reject",function(done){
                promiseMany([1,Promise.reject(2),new Promise(function(resolve,reject){
                    setTimeout(function(){resolve(3)},20)
                })]).then(function(){
                    throw new Error("Nope");
                    done();
                },function(result){
                    expect(result).to.be.ok;
                    expect(result.length).to.equal(3);
                    expect(result).to.have.members([1,2,3])
                    done();
                });
            });
        });
    });
})(typeof module === 'object' && module.exports && typeof define !== 'function'
    ? function (factory) { module.exports = factory(require, module.exports, module); }
    : define
);
