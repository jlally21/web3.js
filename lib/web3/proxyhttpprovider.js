/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
/*
 * @author:
 *   Joseph Lally
 * @date 2017
 */

var errors = require('web3-core-helpers').errors;
var XHR2 = require('xhr2'); // jshint ignore: line

var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');

/**
 * ProxyHttpProvider should be used to send rpc calls over https when behind a proxy
 */
var ProxyHttpProvider = function ProxyHttpProvider(host, path, timeout) {
    this.host = host || 'http://localhost:8545';
    this.path = path || '/';
    this.timeout = timeout || 0;
    this.connected = false;
};


/**
 * Should be used to make async request
 *
 * @method send
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
ProxyHttpProvider.prototype.send = function (payload, callback) {
    var _this = this;
    
    // Use the environment variables or set proxy server manually.
    var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy || process.env.HTTPS_PROXY || 'https://168.63.76.32:3128';
  //  console.log('  - using proxy server %j', proxyServer);

    var options = {
        agent: new HttpsProxyAgent(proxyServer),       // <-- proxy agent
        host: this.host,
        port: 443,
        path: this.path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    };
    
    var req = https.request(options, function (res) {
        var response = "";
        var error = null;
    
        res.on("data", function (chunk) {
            response += chunk;
        });
    
        res.on("end", function () {
            callback(error, JSON.parse(response))
        });
    });
    req.write(JSON.stringify(payload));
    req.end();
}

module.exports = ProxyHttpProvider;
