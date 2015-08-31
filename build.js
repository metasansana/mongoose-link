
/**
 * sync fetches all the data at once and merges it in.
 * Use this method for more efficient querying of MongoDB, keep
 * in mind the merge will take place in one go.
 *
 *  
 * @param  {mongoose.Model} model The model to query
 * @param  {string} spec   A string that tells us the path on the object to populate and the path
 *                         to query, eg. doctor:user
 * @param  {Object} [fields] Will be passed as the fields argument to the mongoose query.
 * @return {Array}
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.sync = sync;

function sync(model, spec, fields) {

  return function accept_docs_multi(docs) {

    var ref;
    var path;
    var args = [];
    var thisDoc;
    var index;
    var query = {};

    spec = spec.split(':');
    ref = spec[0];
    path = spec[1];
    query[path] = {
      $in: args.concat.apply(args, docs.map(function (doc) {
        return doc[ref];
      }))
    };

    return model.find(query, fields).lean().exec().then(function link_related_docs(related) {
      related.forEach(function (rel) {

        docs.forEach(function (doc) {
          thisDoc = doc[ref];
          if (Array.isArray(thisDoc)) {

            thisDoc.forEach(function (item, i) {
              if (item === doc[path]) thisDoc[i] = doc;
            });
          } else {

            if (thisDoc === rel[path]) doc[ref] = rel;
          }
        });
      });

      return docs;
    });
  };
}

