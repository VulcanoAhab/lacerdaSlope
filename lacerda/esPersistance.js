var exports = module.exports;


var elasticsearch = require('elasticsearch');
var lacerda= require('./es_utils.js');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var esUtils=lacerda.esUtils;

var BaseES = {

  doctype:undefined,


  test_index:esUtils.test_lacerda.bind(this, client, this.doctype),

  insert_doc:function (doc) {

    var datis=new Date(new Date().getTime());
    var _id=doc['item_id'];
    doc.emarket=this.doctype;
    client.index({
      index: esUtils.index,
      type: this.doctype,
      id:esUtils.time_id(_id),
      body: doc,
      },function(err,resp) {
        console.log("(•) INSERTED: ",resp);
    });
  },

  delete_all: function() {
      client.deleteByQuery({
        'index':esUtils.index,
        'type':this.doctype,
        'body':{'query':{'term':{'emarket':this.doctype}}}}),
        function(err,resp,status) {
          console.log("(•) Deleted",resp);
        }
    },

  update_doc:function (id, doc) {
      client.update({
        index:esUtils.index,
        type:this.doctype,
        id:id,
        body:doc,
      },function(err, resp, status){console.log("(•) UPDATE: ", resp)})
  },

  fetch_noDescription:function (callback, ctx) {

      var search_query={
        index:esUtils.index,
        type:this.doctype,
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
exports.BaseES=BaseES;
