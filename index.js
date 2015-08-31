
/**
 * link
 * @param  {mongoose.Model} model The model to query
 * @param  {string} spec   A string that tells us the path on the object to populate and the path
 *                         to query, eg. doctor:user
 * @param  {Object} [fields] Will be passed as the fields argument to the mongoose query.
 * @return {Array}
 */
 export default function link(model, spec, fields) {

  return function accept_docs_multi (docs) {

    var ref;
    var path;
    var args = [];
    var thisDoc;
    var index;

    spec = spec.split(':');
    ref = spec[0];
    path = spec[1];

    return model.find({
      $in:args.concat.apply(args,docs.map(doc=>doc[ref]))
    }).
    lean().
    exec().
    then(function link_related_docs(related) {
      related.forEach(function(rel) {

        docs.forEach(function(doc) {
          thisDoc = doc[ref];
          if(Array.isArray(thisDoc)) {

            thisDoc.forEach(function(item, i){
              if(item === doc[path])
                thisDoc[i] = doc;
            });

          }else {

            if(thisDoc === rel[path])
             doc[ref] = rel;

         }

       });

      });

      return docs;

    })


  }

}

