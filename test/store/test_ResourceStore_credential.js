'use strict';

var assert = require('power-assert');
var ResourceStore = require('../../script/store/ResourceStore');

var PATH_PREFIX = '/test/resource_store';

describe('ResourceStore', function () {

    describe('check whether credentials are sent', function(){
        var promise = null;
        before(function(){
            var create = ResourceStore.get(PATH_PREFIX + '/credentials/create/', 'text/plain');
            promise = create.then(function(){
                return ResourceStore.get(PATH_PREFIX + '/credentials/confirm/', 'text/plain');
            });
        });

        after(function(done){
            promise = null;
            ResourceStore.get(PATH_PREFIX + '/credentials/clear/', 'text/plain')
                .then(function(){
                    done();
                });
        });

        it('credentials is sent', function(){
            var callback = function (res) {
                assert.strictEqual(res.status, 200);
            };

            return promise.then(callback, callback);
        });
    });
});
