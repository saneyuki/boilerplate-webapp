'use strict';

var assert = require('power-assert');
var ResourceStore = require('../../script/store/ResourceStore');
var shouldFulfilled = require('promise-test-helper').shouldFulfilled;
var shouldRejected = require('promise-test-helper').shouldRejected;

var PATH_PREFIX = '/test/resource_store';

describe('ResourceStore', function () {

    describe('get(): status code: 20x', function(){
        var promise = null;
        var text = null;

        before(function(){
            promise = ResourceStore.get(PATH_PREFIX + '/get_200/', 'text/plain');
            text = promise.then(function(res){
                return res.text();
            });
        });

        after(function(){
            promise = null;
        });

        it('the promise should be fullfilled', function(){
            return shouldFulfilled(promise).then(function () {
                assert.ok(true);
            });
        });

        it('the status code should be excepted', function(){
            return shouldFulfilled(promise).then(function (res) {
                assert.strictEqual(res.status, 200);
            });
        });

        it('the body text should be fullfilled', function(){
            return shouldFulfilled(text).then(function () {
                assert.ok(true);
            });
        });

        it('the body value value should be expected.', function(){
            return shouldFulfilled(text).then(function(val){
                assert.strictEqual(val, 'get-200-expected');
            });
        });
    });

    [300, 400, 500].forEach(function(i){
        describe('get(): status code: ' + String(i), function(){
            var promise = null;
            var text = null;

            before(function(){
                promise = ResourceStore.get(PATH_PREFIX + '/get_' + String(i) + '/', 'text/plain');
                text = promise.catch(function(res){
                    return res.text();
                });
            });

            after(function(){
                promise = null;
                text = null;
            });

            it('the promise should be rejected', function(){
                return shouldRejected(promise).catch(function () {
                    assert.ok(true);
                });
            });

            it('the status code should be excepted', function(){
                return shouldRejected(promise).catch(function (res) {
                    assert.strictEqual(res.status, i);
                });
            });

            it('the body text should be fullfilled', function(){
                return shouldFulfilled(text).then(function () {
                    assert.ok(true);
                });
            });

            it('the body value value should be expected.', function(){
                return shouldFulfilled(text).then(function(val){
                    assert.strictEqual(val, 'get-' + String(i) + '-expected');
                });
            });
        });
    });

    describe('get(): invalid request parameter', function(){
        var promise = null;

        before(function(){
            promise = ResourceStore.get('asjjsadlkjaskjdljaskjdajs://localhost/', 'text/plain');
        });

        after(function(){
            promise = null;
        });

        it('the promise should be rejected.', function () {
            return shouldRejected(promise).catch(function(){
                assert.ok(true);
            });
        });
    });

    describe('getJSON(): status code: 20x', function(){
        var promise = null;

        before(function(){
            promise = ResourceStore.getJSON(PATH_PREFIX + '/get_200_json/');
        });

        after(function(){
            promise = null;
        });

        it('the promise should be fullfilled', function(){
            return shouldFulfilled(promise).then(function () {
                assert.ok(true);
            });
        });

        it('the body value value should be expected.', function(){
            return shouldFulfilled(promise).then(function(result){
                assert.strictEqual(result.value, 'get-200-json');
            });
        });
    });

    [300, 400, 500].forEach(function(i){
        describe('getJSON(): status code: ' + String(i), function(){
            var promise = null;

            before(function(){
                promise = ResourceStore.getJSON(PATH_PREFIX + '/get_' + String(i) + '_json/');
            });

            after(function(){
                promise = null;
            });

            it('the promise should be rejected', function(){
                return shouldRejected(promise).catch(function () {
                    assert.ok(true);
                });
            });

            it('the value should be excepted', function(){
                return shouldRejected(promise).catch(function (result) {
                    assert.strictEqual(result.value, 'get-' + String(i) + '-json');
                });
            });
        });
    });

    describe('getJSON(): invalid request parameter', function(){
        var promise = null;

        before(function(){
            promise = ResourceStore.getJSON('asjjsadlkjaskjdljaskjdajs://localhost/');
        });

        after(function(){
            promise = null;
        });

        it('the promise should be rejected.', function () {
            return shouldRejected(promise).catch(function(){
                assert.ok(true);
            });
        });

        it('the resut should be error', function(){
            return shouldRejected(promise).catch(function(value){
                assert.ok(value instanceof TypeError);
            });
        });
    });

    describe('getJSON(): broken response: 200', function(){
        var promise = null;

        before(function(){
            promise = ResourceStore.getJSON(PATH_PREFIX + '/get_200_broken_json/');
        });

        after(function(){
            promise = null;
        });

        it('the promise should be rejected.', function () {
            return shouldRejected(promise).catch(function(){
                assert.ok(true);
            });
        });

        it('the resut should be null', function(){
            return shouldRejected(promise).catch(function(result){
                assert.strictEqual(result, null);
            });
        });
    });

    describe('getJSON(): broken response: 400', function(){
        var promise = null;

        before(function(){
            promise = ResourceStore.getJSON(PATH_PREFIX + '/get_400_broken_json/');
        });

        after(function(){
            promise = null;
        });

        it('the promise should be rejected.', function () {
            return shouldRejected(promise).catch(function(){
                assert.ok(true);
            });
        });

        it('the resut should be null', function(){
            return shouldRejected(promise).catch(function(result){
                assert.strictEqual(result, null);
            });
        });
    });
});
