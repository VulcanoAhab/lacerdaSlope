var exports=module.exports;

var Horseman = require('node-horseman');
var fs = require('fs');

var emarket=require('./response_search.js')
var mconfigs=require('./configs.json');
var esLacerda=require('../lacerda/es_utils.js');
var esUtils=esLacerda.esUtils;

var oSearch = function () {
  this.urls_list=[];
  this.configs=mconfigs;
  this.bases={
    "brazil":function(term, pageNumber) {
      _url="http://www.olx.com.br/brasil?o="
      _url+=pageNumber
      _url+="&ot=1&q="+term
      return _url
    }
  };

  this.mount_url=function(keyword, country_name, pageNumber) {

    _buildUrl=this.bases[country_name.toLowerCase()];
    _url=_buildUrl(keyword, pageNumber)

    return {"url":_url,
            "search_term":keyword,
            "country":country_name,
            "pageNumber":pageNumber}
  };

  // this.add_url=function(keyword, country_id, category_id, offset){
  //   var url=this.mount_url(keyword, country_id, category_id, offset);
  //   this.urls_list.push(url);
  // }
  //
  // this.mount_urls=function () {
  //   var ilimit=mconfigs.keywords.length;
  //   //var ilimit=2;
  //   for (i=0; i<ilimit; i++){
  //     var keyword=mconfigs.keywords[i];
  //     var jlimit=mconfigs.countries.length;
  //     //var jlimit=2;
  //     for (j=0; j<jlimit;j++){
  //       var country=mconfigs.countries[j];
  //       climit=mconfigs.categories.length
  //       for (c=0; c<climit; c++){
  //         var category=mconfigs.categories[c];
  //         this.add_url(keyword, country, category, 0);
  //       }
  //     }
  //   }
  // }


  this.search=function(url) {
    var that=this;
    var horseman = new Horseman();

    horseman
      .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
      .open(url)

      //=== persist html file ===
      // .html()
      // .then(function(htmlPage){
      //   fs.writeFile('test.html', htmlPage, function (err) {
      //     if (err) throw err;
      //     console.log('Saved!');
      //   });
      // })

      .log()

      // .type('input[name="q"]', 'github')
      // .click('[name="btnK"]')
      // .keyboardEvent('keypress', 16777221)
      // .waitForSelector('div.g')
      // .count('div.g')
      .close();



  // this.search_many=function () {
  //   this.urls_list.map( function(e) {
  // }
  //
  }
}


var olxis=new oSearch();
var _urlObj=olxis.mount_url("tv box", "Brazil", 1);
olxis.search(_urlObj.url);

//exports.oSearch=oSearch
