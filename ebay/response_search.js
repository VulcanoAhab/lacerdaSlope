var exports = module.exports;

var db=require('./persistance.js');
var lacerda=require('../lacerda/es_utils.js');

var esUtils=lacerda.esUtils;

var helper = function(){
  this.test_value=function(value){
    if (!value){return value;}
    return value[0];
  }

  this.test_money=function(sellingstatus, key){
    if (!sellingstatus){return sellingstatus};
    return sellingstatus[0].currentPrice[0][key]
  }
}

var helpis=new helper();

var response = function () {

  this.results=[];

  this.metadata={};

  this.parse=function(raw_response){

    var _response=JSON.parse(raw_response);

    var _findItems=_response.findItemsByKeywordsResponse[0];
    var _itens=_findItems.searchResult[0];
    var _search=_itens.item;

    var pagination=_findItems.paginationOutput[0];
    this.metadata.pages_total=pagination.totalPages;
    this.metadata.pages_number=pagination.pageNumber;

    var status=_findItems.ack[0];
    var item_count=_itens["@count"];
    var search_results=[];

    console.log("[+] COUNT", item_count)

    if (status != "Success") {
      throw new Error("[REQUEST FAIL]");
    }

    if (item_count>0) {
      for (i=0; i<_search.length; i++){
        var _resp=_search[i];
        var resp={
          "item_id":_resp.itemId[0],
          "title":_resp.title[0],
          "title_cloud":esUtils.textToWordsList(_resp.title[0]),
          "location":_resp.location[0],
          "url":_resp.viewItemURL[0],
          "subtitle":helpis.test_value(_resp.subtitle),
          "payment":helpis.test_value(_resp.paymentMethod),
          "currency":helpis.test_money(_resp.sellingStatus, '@currencyId'),
          "price":helpis.test_money(_resp.sellingStatus, '__value__'),
        }

        //update metadata
        resp.search_term=this.metadata.search_term;
        resp.search_created_at=this.metadata.search_created_at;
        resp.description='toDo';
        resp.page=this.metadata.pages_number;

        //keep in results
        this.results.push(resp);
      }}
    }

  this.insert=function () {
      this.results.map(function(e){db.EbayES.insert_doc(e);})
  }

}

exports.response=response;
