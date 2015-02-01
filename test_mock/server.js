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

var argv = require('yargs').argv;
var http = require('http');
var url = require('url');
var ResourceStoreMock = require('./mock_resouce_store');

var route = {
    '/api/bar': function (res) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({
            bar: 1,
        }));
    },
};


/*
 *  Test for ResourceStore:
 */
var RESOUCE_STORE_PATH_PREFIX = '/test/resource_store';
route[RESOUCE_STORE_PATH_PREFIX + '/get_200/'] = ResourceStoreMock.get200;
route[RESOUCE_STORE_PATH_PREFIX + '/get_200_json/'] = ResourceStoreMock.get200JSON;

route[RESOUCE_STORE_PATH_PREFIX + '/get_300/'] = ResourceStoreMock.get300;
route[RESOUCE_STORE_PATH_PREFIX + '/get_300_json/'] = ResourceStoreMock.get300JSON;

route[RESOUCE_STORE_PATH_PREFIX + '/get_400/'] = ResourceStoreMock.get400;
route[RESOUCE_STORE_PATH_PREFIX + '/get_400_json/'] = ResourceStoreMock.get400JSON;

route[RESOUCE_STORE_PATH_PREFIX + '/get_500/'] = ResourceStoreMock.get500;
route[RESOUCE_STORE_PATH_PREFIX + '/get_500_json/'] = ResourceStoreMock.get500JSON;

route[RESOUCE_STORE_PATH_PREFIX + '/get_200_broken_json/'] = ResourceStoreMock.get200BrokenJSON;
route[RESOUCE_STORE_PATH_PREFIX + '/get_400_broken_json/'] = ResourceStoreMock.get400BrokenJSON;

route[RESOUCE_STORE_PATH_PREFIX + '/get_403/'] = ResourceStoreMock.get403;
route[RESOUCE_STORE_PATH_PREFIX + '/get_403_json/'] = ResourceStoreMock.get403JSON;
route[RESOUCE_STORE_PATH_PREFIX + '/get_403_broken_json/'] = ResourceStoreMock.get403BrokenJSON;

/*
 *  Server
 */
http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var hasRoute = path in route;
    if (hasRoute) {
        route[path](res, req);
    }
    else {
        res.writeHead(404);
        res.end();
    }
}).listen(argv.port);
