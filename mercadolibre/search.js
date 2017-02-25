var exports=module.exports;

var request=require('request');
var mercado=require('./response_search.js')
var mconfigs=require('./configs.json');

var mSearch = function () {
  this.urls_list=[];
  this.configs=mconfigs;

  this.mount_urls=function () {
    mconfigs.keywords.forEach(
      function(keyword){

      }
    );

  }



}
