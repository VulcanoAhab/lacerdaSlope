var exports = module.exports;


var elasticsearch = require('elasticsearch');
var lacerda= require('../lacerda/es_utils.js');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var doctype='ebay';
var esUtils=lacerda.esUtils;

var EbayES = {

  test_index:esUtils.test_lacerda.bind(this, client, doctype),

  insert_doc:function (doc) {
    var datis=new Date(new Date().getTime());
    var _id=doc['item_id']
    client.index({
      index: esUtils.index,
      type: doctype,
      id:esUtils.time_id(_id),
      body: doc,
      },function(err,resp,status) {
        console.log("(•) INSERT: ",resp);
    });
  },

  delete_all: esUtils.delete_all_byType.bind(this, client, esUtils.index, doctype),

  update_doc:function (id, doc) {
      client.update({
        index:esUtils.index,
        type:doctype,
        id:id,
        body:doc,
      },function(err, resp, status){console.log("(•) UPDATE: ", resp)})
  },

  fetch_noDescription:function (callback, ctx) {

      var search_query={
        index:esUtils.index,
        type:doctype,
        scroll: '30s',
        _source:['item_id',],
        body: {
          query: {
            match: { "description": "toDo" }
          },
        }
      }

      var noDescription=[];

      client.search(search_query, function getMoreUntilDone(error, response) {
        // collect the title from each response
        response.hits.hits.forEach(function (hit) {
        noDescription.push({"es_id":hit._id, "product_code":hit._source.item_id});
        });

        if (response.hits.total > noDescription.length) {
          client.scroll({
          scrollId: response._scroll_id,
            scroll: '30s'
              }, getMoreUntilDone);
            } else {
              console.log('(•) Done collecting to noDescription: ', noDescription.length);
              callback(noDescription, ctx);
            }
      });

  }



}


//api
exports.EbayES=EbayES;
