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

var MIME_TEXT = 'text/plain';
var MIME_JSON = 'application/json';

module.exports = Object.freeze({
    get200: function (res) {
        res.writeHead(200, {
            'Content-Type': MIME_TEXT,
        });
        res.end('get-200-expected');
    },
    get200JSON: function (res) {
        res.writeHead(200, {
            'Content-Type': MIME_JSON,
        });
        res.end(JSON.stringify({
            value: 'get-200-json',
        }));
    },

    get300: function (res) {
        res.writeHead(300, {
            'Content-Type': MIME_TEXT,
        });
        res.end('get-300-expected');
    },
    get300JSON: function (res) {
        res.writeHead(300, {
            'Content-Type': MIME_JSON,
        });
        res.end(JSON.stringify({
            value: 'get-300-json',
        }));
    },

    get400: function (res) {
        res.writeHead(400, {
            'Content-Type': MIME_TEXT,
        });
        res.end('get-400-expected');
    },
    get400JSON: function (res) {
        res.writeHead(400, {
            'Content-Type': MIME_JSON,
        });
        res.end(JSON.stringify({
            value: 'get-400-json',
        }));
    },

    get500: function (res) {
        res.writeHead(500, {
            'Content-Type': MIME_TEXT,
        });
        res.end('get-500-expected');
    },
    get500JSON: function (res) {
        res.writeHead(500, {
            'Content-Type': MIME_JSON,
        });
        res.end(JSON.stringify({
            value: 'get-500-json',
        }));
    },

    get200BrokenJSON: function (res) {
        res.writeHead(200, {
            'Content-Type': MIME_JSON,
        });
        res.end('{,,,,,}');
    },
    get400BrokenJSON: function (res) {
        res.writeHead(400, {
            'Content-Type': MIME_JSON,
        });
        res.end('{,,,,,}');
    },
});
