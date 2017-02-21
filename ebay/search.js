var request = require('request');
var ebay = require('./response_search.js');
var econfigs = require('./configs.json');

var eSearch = function () {

  this.urls_list=[];
  this.configs=econfigs;

  this.mount_urls=function (){
    var page_index=1;
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
          url += "&paginationInput.pageNumber="+page_index;
          url += "&SECURITY-APPNAME="+this.configs.app_id;


      this.urls_list.push({'url':url,
                           'search_term':keyword,
                           'page_index':page_index});
    }
    console.log("(•) Done mounting "+ this.urls_list.length +" URl[s]")
    return this
  }

  this.paging_url=function(url, next_page_number){
    var target_rex="&paginationInput.pageNumber=(\d+)"
    var rex_res=target_rex.exec(url);
    if (!rex_res[1]) || (rex_res[1] >= next_page_number){
      return 'end';
    }
    var to_replace=rex_res[0];
    var new_value="&paginationInput.pageNumber="+rex_res[1];
    var new_url=url.replace(to_replace, new_value);
    return new_url;
  }

  this.search_keyword=function(url, search_term, page_index) {

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
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
              var next_url=this.paging_url(url, next_page);
              if (nex_url != 'end') {
                this.search_keyword(next_url, search_term, next_page);
              }
            }

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
      var page_index=e.page_index;

      this.search_keyword(url, search_term);}, this)
  }


}

console.log("(•) STARTING EBAY SEARCH")
search_ebay=new eSearch();
search_ebay.mount_urls().search_many()
