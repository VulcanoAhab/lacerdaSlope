var request = require('request');
var ebay = require('./ebay_response.js');
var econfigs = require('./ebay_configs.json');

var eSearch = function () {

  this.urls_list=[];
  this.configs=econfigs;

  this.mount_urls=function (){
    for (i=0; i<this.configs.keywords.length; i++) {
      var keyword=this.configs.keywords[i];
      var url = "http://svcs.ebay.com/services/search/FindingService/v1";
          url += "?OPERATION-NAME=findItemsByKeywords";
          url += "&SERVICE-VERSION=1.0.0";
          url += "&GLOBAL-ID=EBAY-US";
          url += "&RESPONSE-DATA-FORMAT=JSON";
          url += "&REST-PAYLOAD";
          url += "&keywords="+keyword;
          url += "&paginationInput.entriesPerPage=100";
          url += "&SECURITY-APPNAME="+this.configs.app_id;
      this.urls_list.push({'url':url, 'search_term':keyword});
    }
    console.log("(•) Done mounting "+ this.urls_list.length +" URl[s]")
    return this
  }

  this.search_keyword=function(url, search_term) {

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var resp=new ebay.response();

            //search metadata
            var datis=new Date(new Date().getTime()).toString();
            resp.metadata.created_at=datis;
            resp.metadata.search_term=search_term;
            resp.metadata.url=url;

            //body
            resp.parse(body);
            resp.insert();

            }
        else {
              console.log("(••) ERROR " + body);
        }
      })
  }

  this.search_many=function () {

    this.urls_list.map( function(e) {

      var url=e.url;
      var search_term=e.search_term;

      this.search_keyword(url, search_term);
    }, this)
  }


}

console.log("(•) STARTING EBAY SEARCH")
search_ebay=new eSearch();
search_ebay.mount_urls().search_many()
