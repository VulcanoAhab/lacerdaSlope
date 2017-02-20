var request = require('request');
var ebay = require('./ebay_response.js');
var econfigs = require('./ebay_configs.json');

var ebay_interface = {

  urls_list:[],
  configs:econfigs,

  mount_urls:function (){
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
      this.urls_list.push(url);
    }
    console.log("(•) Done mounting "+ this.urls_list.length +" URl[s]")
    return this
  },

  search:function () {
    for (i=0;i<this.urls_list.length;i++) {
      var url=this.urls_list[i];
      console.log('(•) GET: '+ url);
      request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
                var response=new ebay.response();
                response.parse(body);
                response.insert();
              }
          else {
                console.log("(••) ERROR " + body);
          }
      })
    }
  }

}

console.log("(•) STARTING EBAY SEARCH")
ebay_interface.mount_urls().search()
