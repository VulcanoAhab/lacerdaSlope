var exports = module.exports;

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

  this.parse=function(raw_response){

    var _response=JSON.parse(raw_response);
    var _itens=_response.findItemsByKeywordsResponse[0].searchResult[0];
    var _search=_itens.item;

    var status=_response.findItemsByKeywordsResponse[0].ack[0];
    var item_count=_itens["@count"];
    var search_results=[];

    if (status != "Success") {
      throw new Error("[REQUEST FAIL]");
    }

    if (item_count>0) {
      for (i=0; i<_search.length; i++){
        var _resp=_search[i];
        var resp={
          "id":_resp.itemId[0],
          "title":_resp.title[0],
          "location":_resp.location[0],
          "url":_resp.viewItemURL[0],
          "subtitle":helpis.test_value(_resp.subtitle),
          "payment":helpis.test_value(_resp.paymentMethod),
          "currency":helpis.test_money(_resp.sellingStatus, '@currencyId'),
          "price":helpis.test_money(_resp.sellingStatus, '__value__'),
        }
        this.results.push(resp);
      }}
    }

  this.insert=function () {
      this.results.map(function(e){console.log(e);})
  }

}

exports.response=response;
