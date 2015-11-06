var _ = require('./lodash');

var log = require('./log');

var util = {};

util.getObjectType = function getObjectType(obj) {
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((obj).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
};

util.getObjectTypesOfElements = function getObjectTypesOfElements(arr) {
    return _.uniq(arr.map(util.getObjectType));
};

// simple implementation of type validation of objects before extending target object to a model
util.strongExtend = function strongExtend(obj, model) {

	var erred = false;

    // compare the object type (class constructor) of the values in both objects
    var modelVal, modelValType, modelValTypesOfElements,
        objVal, objValType, objValTypesOfElements,
        isInvalidKey;
    Object.keys(obj).forEach(function(key) {
    	isInvalidKey = false;

        if ((modelVal = model[key]) != undefined) {
        	modelValType = util.getObjectType(modelVal);
        } else log.error("The key \"%s\" is invalid.", key), erred = isInvalidKey = true;
        objValType = util.getObjectType(objVal = obj[key]);
        // if object type of value for key in object does not match that of the model,
        if (objValType !== modelValType && !isInvalidKey) {
        	// throw an error
            log.error("The value associated with the key \"%s\" must be of type %s.", key, modelValType);
            erred = true;

        // if value in object is valid,
        } else {
        	// do some further type validation
            switch (modelValType) {
            	// for object types such as arrays
                case "Array":
                	// allow the elements of the array in the target object to be of any of the types enumerated in the model
                    modelValTypesOfElements = util.getObjectTypesOfElements(modelVal); // all allowed object types of elements in the array
                    objValTypesOfElements = util.getObjectTypesOfElements(objVal); // existing object types in array
                    objValTypesOfElements.forEach(function forEachElementType(objValTypeOfElement) {
                        if (!_.includes(modelValTypesOfElements, objValTypeOfElement)) { // if there is any type of an element in the array that is not in the list of allowed types
                            // throw an error
                            log.error("The array associated with the key \"%s\" contains an element of unallowed type: %s.", key, objValTypeOfElement);
                            erred = true;
                        }
                    });
                    break;
            }
        }
    });

    if (!erred) _.defaults(obj, model);
};


module.exports = util;
