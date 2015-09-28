'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.sync = sync;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _propertySeek = require('property-seek');

var _propertySeek2 = _interopRequireDefault(_propertySeek);

var DEFAULT_CONFIG = {
    lean: true
};

/**
 * sync fetches all the data at once and merges it in.
 * Use this method for more efficient querying of MongoDB, keep
 * in mind the merge will take place in one go.
 * 
 * @param  {mongoose.Model} model The model to query
 * @param  {string} spec   A string that tells us the path on the object to populate and the path
 *                         to query, eg. doctor:user
 * @param  {Object} [fields] Will be passed as the fields argument to the mongoose query.
 * @param {Config} [config] A configuration object
 * @return {Array}
 */

function sync(model, spec, fields, config) {

    return function accept_docs_to_be_linked(docs) {

        var localPath;
        var relatedPath;
        var args = [];
        var link;
        var query = {};
        var atlas = {};
        var p;

        config = config || DEFAULT_CONFIG;
        if (!docs) return docs;

        docs = Array.isArray(docs) ? docs : [docs];
        spec = spec.split(':');
        localPath = spec[0];
        relatedPath = spec[1];

        query[relatedPath] = {
            $in: args.concat.apply(args, docs.map(function (doc) {
                return doc[localPath];
            }).filter(function (x) {
                return x;
            })).filter(function (item, index, all) {
                return all.indexOf(item) === index;
            })
        };

        console.log('qery ', query);

        p = model.find(query, fields);
        if (config.lean) p = p.lean();
        return p.exec().then(function (related) {

            if (!Array.isArray(related)) return related;

            //Create an atlas (map) of the related documents
            //using the relatedPath as the keys
            related.forEach(function (rel) {
                atlas[_propertySeek2['default'].get(rel, relatedPath)] = rel;
            });

            return docs.map(function (doc) {

                if (Array.isArray(doc[localPath])) {

                    doc[localPath] = doc[localPath].map(function (ref) {
                        return atlas[ref] ? atlas[ref] : null;
                    });
                } else {

                    doc[localPath] = atlas[doc[localPath]] ? atlas[doc[localPath]] : null;
                }

                return doc;
            });
        });
    };
}

