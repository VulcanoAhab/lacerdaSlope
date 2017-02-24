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

  delete_all: esUtils.delete_all_byType.bind(this, esUtils.index, doctype),

  update_doc:function (id, doc) {
      client.update({
        index:esUtils.index,
        type:doctype,
        id:id,
        //body:{"script":{"inline":"ctx._source.currency='teste'"}}},
        body:doc,},
          function(err, resp, status){console.log("(•) UPDATE: ", resp)})
  },

  fetch_noDescription:function () {

      var search_query={
        index:esUtils.index,
        type:doctype,
        scroll: '30s'
        body: {
          query: {
            match: { "currency": "USD" }
          },
        }
      }





}


//api
exports.EbayES=EbayES;
