var exports = module.exports;

var response = function(raw_response){

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
        "url":_resp.viewItemURL[0]
      }
      search_results.push(resp);
    }
  }
  return search_results
}

exports.response=response;
