var request = require('request');
var ebay = require('./response_search.js');
var econfigs = require('./configs.json');

var lacerda=require('../lacerda/es_utils.js');
var esUtils=lacerda.esUtils;

var eSearch = function () {

  this.urls_list=[];
  this.configs=econfigs;

  this.mount_urls=function (){
    var page_index=1;
    for (i=0; i<this.configs.keywords.length; i++) {
      var keyword=this.configs.keywords[i];
      var countryCode="BR"; 
      var url = "http://svcs.ebay.com/services/search/FindingService/v1";
          url += "?OPERATION-NAME=findItemsByKeywords";
          url += "&SERVICE-VERSION=1.0.0";
          url += "&GLOBAL-ID=EBAY-US";
          url += "&RESPONSE-DATA-FORMAT=JSON";
          url += "&REST-PAYLOAD";
          url += "&keywords="+keyword;
          url += "&paginationInput.entriesPerPage=100";
          url += "&paginationInput.pageNumber="+page_index;
          url +="&itemFilter(0).name=LocatedIn";
          url +="&itemFilter(0).value="+countryCode;
          url += "&SECURITY-APPNAME="+this.configs.app_id;


      this.urls_list.push({'url':url,
                           'search_term':keyword,
                           'page_index':page_index});
    }
    console.log("(•) Done mounting "+ this.urls_list.length +" URl[s]")
    return this
  }

  this.search_keyword=function(url, search_term, page_index) {
      var that=this;
      request(url, function (error, response, body) {
        console.log("IN REQUEST");
        if (!error && response.statusCode == 200) {
            console.log("GOT RESULTS");
            var resp=new ebay.response();

            //search metadata
            var datis=new Date(new Date().getTime()).toString();
            resp.metadata.created_at=datis;
            resp.metadata.search_term=search_term;

            //body
            resp.parse(body);
            resp.insert();

            //test for pagination
            if (resp.metadata.pages_number > page_index){
              var next_page=page_index+1;
              var rex_string="&paginationInput.pageNumber="
              var next_url=esUtils.paging_url(url, next_page, rex_string);
              if (next_url != 'end') {
                that.search_keyword(next_url, search_term, next_page);
              }
            }

            }
        else {
          console.log("(••) REQUEST ERROR " + body);
        }
      })
  }

  this.search_many=function () {
    this.urls_list.map( function(e) {
      var url=e.url;
      var search_term=e.search_term;
      var page_index=e.page_index;
      this.search_keyword(url, search_term);}, this)
  }


}

console.log("(•) STARTING EBAY SEARCH")
search_ebay=new eSearch();
search_ebay.mount_urls();
search_ebay.search_many();
