var exports=module.exports;

var request=require('request');
var emarket=require('./response_search.js')
var mconfigs=require('./configs.json');

var esLacerda=require('../lacerda/es_utils.js');
var esUtils=esLacerda.esUtils;

var mSearch = function () {
  this.urls_list=[];
  this.configs=mconfigs;

  this.mount_url=function(keyword, country_id, category_id, offset) {
    var _url="https://api.mercadolibre.com/sites/";
        _url+=country_id;
        _url+="/search?q="+keyword;
        _url+="&category="+country_id+category_id;
        _url+="&offset="+offset;

    return {"url":_url,
            "search_term":keyword,
            "country":country_id,
            "offset":offset}
  }

  this.add_url=function(keyword, country_id, category_id, offset){
    var url=this.mount_url(keyword, country_id, category_id, offset);
    this.urls_list.push(url);
  }

  this.mount_urls=function () {
    var ilimit=mconfigs.keywords.length;
    //var ilimit=2;
    for (i=0; i<ilimit; i++){
      var keyword=mconfigs.keywords[i];
      var jlimit=mconfigs.countries.length;
      //var jlimit=2;
      for (j=0; j<jlimit;j++){
        var country=mconfigs.countries[j];
        climit=mconfigs.categories.length
        for (c=0; c<climit; c++){
          var category=mconfigs.categories[c];
          this.add_url(keyword, country, category, 0);
        }
      }
    }
  }


  this.search=function(url, search_term, offset) {
    var that=this;

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var resp=new emarket.response();

          //search metadata
          var datis=new Date(new Date().getTime()).toString();
          resp.metadata.search_created_at=datis;
          resp.metadata.search_term=search_term;

          //body
          resp.parse(body);
          resp.insert();

          //test for pagination
          var next_offset=resp.metadata.offset+resp.metadata.limit;
          if (resp.metadata.item_count > next_offset){
            var next_url=esUtils.paging_url(url, next_offset, "&offset=");
            if (next_url != 'end') {
              that.search(next_url, search_term, next_offset);
            }
          }

          }
      else {
        console.log("(••) REQUEST ERROR " + body);
      }
    });
  }

  this.search_many=function () {
    this.urls_list.map( function(e) {
      var url=e.url;
      var search_term=e.search_term;
      var offset=e.offset;
      this.search(url, search_term, offset);}, this)
  }





}

exports.mSearch=mSearch
