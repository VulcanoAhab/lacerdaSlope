var exports = module.exports;


var request = require('request');
var ebay = require('./response_detail.js');
var econfigs = require('./configs.json');
var db=require('./persistance.js')


var eDetail = function() {

  this._targets=[];
  this.configs=econfigs;
  this.urls_list=[];

  this.add_target=function(toDo) {
    this._targets.push({"product_code":toDo.product_code, "es_id":toDo.es_id})
  }

  this.add_all=function(toDos, ctx) {
    toDos.forEach(ctx.add_target, ctx);
  }

  this.productsToEnrinch=function(){

    db.EbayES.fetch_noDescription(this.add_all, this);
    return this
  }

  this.mount_urls=function(){
    var selectors="ItemSpecifics,TextDescription,Variations";
    for (i=0;i<this._targets.length;i++){
      var target_code=this._targets[i].product_code;
      var es_id=this._targets[i].es_id;
      var url ="http://open.api.ebay.com/shopping?callname=GetSingleItem"
          url += "&version=981";
          url += "&appid="+this.configs.app_id;
          url += "&ItemId="+target_code;
          url += "&responseencoding=JSON";
          url += "&IncludeSelector="+selectors;
      this.urls_list.push({ 'url':url,
                            'product_code':target_code,
                            'es_id':es_id})
    }
    //return this;
  }

  this.product_detail=function(request_obj){

    var es_id=request_obj.es_id;
    var item_id=request_obj.product_code;
    var url=request_obj.url;

    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
        var resp=new ebay.response();
        //metadata
        var datis=new Date(new Date().getTime()).toString();

        resp.metadata.detail_created_at=datis;
        resp.metadata.es_id=es_id;
        resp.metadata.item_id=item_id;

        //console.log(body);

        //parse body
        resp.parse(body);
        //update doc
        resp.update();

      } else {
        console.log("(••) REQUEST ERROR " + body);
      }
      })
  }

  this.enrichProducts=function() {
    this.urls_list.forEach(this.product_detail)
  }



}

exports.eDetail=eDetail;
