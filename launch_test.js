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
var ChildProcess = require('child_process');
var EventEmitter = require('events').EventEmitter;
var Path = require('path');
var Promise = require('es6-promise').Promise;

var MOCK_PORT = 9001;

var master = new EventEmitter();

var spawn = function (name, args) {
    var process = new Promise(function(resolve, reject) {
        var child = ChildProcess.spawn(name, args, {
            stdio: 'inherit',
        });
        var killSelf = function() {
            child.kill();
        };
        child.addListener('exit', function listener() {
            child.removeListener('exit', listener);
            master.removeListener('kill-all', killSelf);
            master.emit('kill-all');
            resolve();
        });
        master.addListener('kill-all', killSelf);
    });
    return process;
};

var mock = spawn('node', [Path.join(__dirname, 'test_mock', 'server.js'), '--port', MOCK_PORT]);
console.log('you can access mock server with `localhost:' + MOCK_PORT + '`');

var karma = null;
if (argv.onlyMock) {
    karma = Promise.resolve();
}
else {
    var karmaBin = Path.join(__dirname, 'node_modules', 'karma', 'bin', 'karma');
    karma = spawn(karmaBin, ['start', (argv.debug ? '' : '--single-run')]);
}

process.stdin.resume();
process.on('SIGINT', function() {
    master.emit('kill-all');
});

Promise.all([mock, karma]).then(function(){
    process.exit();
});
