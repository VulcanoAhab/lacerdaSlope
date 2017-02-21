
var request = require('request');
var ebay = require('./response_detail.js');
var econfigs = require('./configs.json');

var eDetail = function() {

  this._targets=[];
  this.configs=econfigs;
  this.urls_list=[];

  this.add_target=function(product_code){
    this._targets.push(product_code)
  }

  this.mount_urls=function(){
    var selectors="ItemSpecifics,TextDescription,Variations";
    for (i=0;i<this._targets.length;i++){
      var target_code=this._targets[i];
      var url ="http://open.api.ebay.com/shopping?callname=GetSingleItem"
          url += "&version=981";
          url += "&appid="+this.configs.app_id;
          url += "&ItemId="+target_code;
          url += "&responseencoding=JSON";
          url += "&IncludeSelector="+selectors;
      this.urls_list.push({'url':url, 'product_code':target_code})
    }
  }

  this.product_detail=function(url){
    if (!error && response.statusCode == 200) {
      request(url, function(error, response, body){
        var resp=new ebay.response();
        //metadata
        var datis=new Date(new Date().getTime()).toString();
        resp.metadata.detail_created_at=datis;
        //parse body
        resp.parse(body);
        resp.update();
      })
    } else {
      console.log("(••) REQUEST ERROR " + body);
    }
  }

  this.fetch_products=function(){
    this.urls_list.map( function(e){
      var url=e.url;
      this.product_detail(url);
    }, this)
  }

}
