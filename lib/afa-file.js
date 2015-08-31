var fs = require('fs'),
	path = require('path');

var _ = require('lodash');

var util = require('./util');

var defaultOptions = {
    freqBinCount: new Number, // a Number
    data: new Array(new Uint8Array) // an Array that only contains elements of type Uint8Array
};

function AFAFile(options) {
	// ensure that `options` adheres strongly to the model (`defaultOptions`) in respect to object types before extending the former to the latter
    util.strongExtend(options, defaultOptions);

    this.data = options.data;
    this.freqBinCount = options.freqBinCount;

    this.renderFile = function(options) {
    	var file = "";

    	if (options.freqBinCount <= 99999) {
    		file +=  ? _.padLeft(options.freqBinCount, 5) + "\n";
    	} else {
    		console.error("freqBinCount is greater than the maximum allowed: 99999");
    		return null;
    	}
    	
    	var ms = [];
    	options.data.forEach(function(freqDataForMs, i) {
    		ms = freqDataForMs;
    		// ms.push(options.waveformData[i])
    		file += ms.join(",") + "\n";
    	});

    	return file;
    };

    var file = this.renderFile({
    	freqBinCount: this.freqBinCount,
    	data: this.data
    });

    this.toString = function() {
    	return file;
    };

    // TODO: toBuffer()
    // TODO: toGzipped()
}

module.exports = AFAFile;