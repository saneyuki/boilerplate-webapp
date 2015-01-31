/*
 * @license MIT License
 *
 * Copyright (c) 2014 Tetsuharu OHZEKI <saneyuki.snyk@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var ResourceStore = {

    /*
     *  @param  {string}    url
     *
     *  @return {Promise<?any>}
     */
    getJSON: function (url) {
        var json = this.get(url, 'application/json')
            .then(function(res){
                return res.json().catch(function() {
                    return Promise.reject(null);
                });
            }, function (res) {
                if (res instanceof TypeError) {
                    throw res;
                }

                return res.json().then(function(json) {
                    return Promise.reject(json);
                }, function() {
                    return Promise.reject(null);
                });
            });
        return json;
    },

    /*
     *  @param  {string}    url
     *  @param  {string}    contentType
     *
     *  @return {Promise<Response|Error>}
     */
    get: function (url, contentType) {
        return fetchResource(url, {
            method: 'get',
            headers: {
                'Accept': contentType,
            },
        });
    },
};

/*
 *  @param  {string}    url
 *  @param  {Object}    option
 *
 *  @return {Promise<Response|Error>}
 *
 *  This function executes following steps:
 *      1. Let `p1` be the return value of `fetch()`
 *      2. Let `status` be the response status code.
 *      3. Let `p2` be promise.
 *      4. With using `status`, check whether the response is valid.
 *        * If `status` is `20x`, `p2` is fulfilled with `p1`'s value.
 *        * If `status` is others, `p2` is rejected with `p1`'s value.
 *      5. Return `p2`.
 */
var fetchResource = function (url, option) {
    var request = window.fetch(url, option)
                        .then(checkStatus);
    return request;
};

/*
 *  Test whether the response is valid with using status code.
 *
 *  @param  {Promise<Response>} res
 *  @return {Promise<Response>}
 */
var checkStatus = function (res) {
    var status = res.status;
    if (status >= 200 && status < 300) {
        return Promise.resolve(res);
    }
    else {
        return Promise.reject(res);
    }
};


module.exports = Object.seal(ResourceStore);
