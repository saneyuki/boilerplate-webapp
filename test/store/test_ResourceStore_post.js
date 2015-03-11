'use strict';

var assert = require('power-assert');

var ResourceStore = require('../../script/store/ResourceStore');
var shouldFulfilled = require('promise-test-helper').shouldFulfilled;
var shouldRejected = require('promise-test-helper').shouldRejected;

var PATH_PREFIX = '/test/resource_store';
var MIME_JSON = 'application/json';

var TestBody = function (num) {
    this.val = num;
};


/*
 * Test approach.
 *
 *  1. The client send a value to a mock server with using `POST` method.
 *  2. The server validates needed paramters, headers, and values of the request.
 *  3. The server responses a suitable status code and body for the request.
 *  4. The client validates the response, if it's expected, the test is success :)
 */
describe('ResourceStore', function () {

    describe('post(): status code: 20x', function(){
        var promise = null;
        var json = null;
        var isNotCalledAuthError = true;
        var callback = function () {
            isNotCalledAuthError = false;
        };

        var value = JSON.stringify(new TestBody(200));

        before(function(){
            ResourceStore.addAuthErrorListener(callback);
            promise = ResourceStore.post(PATH_PREFIX + '/post_200/',
                                         MIME_JSON,
                                         value);
            json = promise.then(function(res){
                return res.json();
            }, function (res) {
                return res.json();
            });
        });

        after(function(){
            ResourceStore.removeAuthErrorListener(callback);
            promise = null;
            json = null;
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

        it('the body should be fullfilled', function(){
            return shouldFulfilled(json).then(function () {
                assert.ok(true);
            });
        });

        it('the body value value should be expected.', function(){
            return shouldFulfilled(json).then(function(json){
                assert.strictEqual(json.isValid, true);
            });
        });

        it('ResourceStore should emit "AuthError" event: should not call the callback', function(){
            assert.ok(isNotCalledAuthError);
        });
    });

    [300, 400, 500].forEach(function(i){
        describe('post(): status code: ' + String(i), function(){
            var promise = null;
            var json = null;
            var isNotCalledAuthError = true;
            var callback = function () {
                isNotCalledAuthError = false;
            };

            var value = JSON.stringify(new TestBody(i));

            before(function(){
                ResourceStore.addAuthErrorListener(callback);
                promise = ResourceStore.post(PATH_PREFIX + '/post_' + String(i) + '/',
                                             MIME_JSON,
                                             value);
                json = promise.catch(function(res){
                    return res.json();
                });
            });

            after(function(){
                ResourceStore.removeAuthErrorListener(callback);
                promise = null;
                json = null;
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

            it('the body json should be fullfilled', function(){
                return shouldFulfilled(json).then(function () {
                    assert.ok(true);
                });
            });

            it('the body value value should be expected.', function(){
                return shouldFulfilled(json).then(function(json){
                    assert.strictEqual(json.isValid, true);
                });
            });

            it('ResourceStore should emit "AuthError" event: should not call the callback', function(){
                assert.ok(isNotCalledAuthError);
            });
        });
    });

    describe('post(): response: 403', function(){
        var promise = null;
        var json = null;
        var isCalledAuthError = false;
        var callback = function(){
            isCalledAuthError = true;
        };
        var value = JSON.stringify(new TestBody(403));
        before(function(){
            ResourceStore.addAuthErrorListener(callback);

            promise = ResourceStore.post(PATH_PREFIX + '/post_403/',
                                         MIME_JSON,
                                         value);
            json = promise.catch(function(res){
                return res.json();
            });
        });

        after(function(){
            ResourceStore.removeAuthErrorListener(callback);
            promise = null;
            json = null;
        });

        it('the promise should be rejected', function(){
            return shouldRejected(promise).catch(function () {
                assert.ok(true);
            });
        });

        it('the status code should be excepted', function(){
            return shouldRejected(promise).catch(function (res) {
                assert.strictEqual(res.status, 403);
            });
        });

        it('the body json should be fullfilled', function(){
            return shouldFulfilled(json).then(function () {
                assert.ok(true);
            });
        });

        it('the body value value should be expected.', function(){
            return shouldFulfilled(json).then(function(json){
                assert.strictEqual(json.isValid, true);
            });
        });

        it('ResourceStore should emit "AuthError" event: should call the callback', function(){
            assert.ok(isCalledAuthError);
        });
    });
});
