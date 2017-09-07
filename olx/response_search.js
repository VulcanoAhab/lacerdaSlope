var exports = module.exports;

var lacerda=require('../lacerda/es_utils.js');
var db=require('./persistance.js')
var esUtils=lacerda.esUtils;

var response = function () {

  this.results=[];
  this.metadata={};
  this.lastUrl="";
  this.Country="";

  this.extract=function(htmlDocument) {
  }

  this.insert=function () {
      this.results.map(function(e){db.mercadoES.insert_doc(e);})
  }

}
//
exports.response=response;
