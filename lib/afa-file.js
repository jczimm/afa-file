var fs = require('fs'),
    path = require('path'),
    zlib = require('zlib');

var _ = require('./lodash');

var util = require('./util');

var defaultOptions = {
    freqBinCount: new Number, // a Number
    sampleRate: new Number, // a Number
    data: new Array(new Uint8Array) // an Array that only contains elements of type Uint8Array
};

function renderFile(options) {
    var file = "";

    // write `freqBinCount` option to the first line of the file if it is <= 5 digits
    var freqBinCount = options.freqBinCount;
    if (freqBinCount.toString().length <= 5) {
        file += _.padLeft(freqBinCount, 5, "0") + "\n";
    } else {
        console.error("`freqBinCount` option has greater than the maximum value allowed: 99999");
        return null;
    }

    // file `sampleRate` option to the second line of the file if it is <= 5 digits
    var sampleRate = options.sampleRate;
    if (sampleRate.toString().length <= 5) {
        file += _.padLeft(sampleRate, 5, "0") + "\n";
    } else {
        console.error("`sampleRate` option has greater than the maximum value allowed: 99999");
        return null;
    }

    // write frequency data to file
    var freqData = options.data,
        dataLength = freqData.length,
        freqDataSample;
    for (var i = 0; i < dataLength; i++) {
        // freqData[i]: frequency data for sample i (a Uint8Array of the amplitudes of audio data in the frequencies measured)
        file += freqData[i].join(",") + "\n";
    }

    return file;
};

function AFAFile(options) {
    // ensure that `options` adheres strongly to the model (`defaultOptions`) in respect to object types before extending the former to the latter
    util.strongExtend(options, defaultOptions);

    this.data = options.data;
    this.freqBinCount = options.freqBinCount;

    var file = renderFile({
        freqBinCount: this.freqBinCount,
        data: this.data,
        sampleRate: this.sampleRate
    });

    this.toString = function toString() {
        return file;
    };

    // returns a Promise which resolves a Buffer or rejects an error from zlip.gzip
    this.toGzipped = function toGzipped() {
        return new Promise(function(resolve, reject) {
            zlib.gzip(file, function(err, result) {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
}

module.exports = AFAFile;
