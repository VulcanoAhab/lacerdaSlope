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
    client.index({
      index: esUtils.index,
      type: doctype,
      body: doc,
      },function(err,resp,status) {
        console.log("(•) INSERT: ",resp);
    });
  },


}

//api
exports.EbayES=EbayES;
