var response = function () {

  this.results=[];

  this.metadata={};

  this.parse=function(raw_response){

    var _response=JSON.parse(raw_response);
    var _search=_response.results;

    var seller_addr=_response.seller_address;s


    var offset=_response.paging.offset;
    var limit=_response.paging.limit;

    var item_count=_response.paging.total;
    var search_results=[];


    if (item_count>0) {
      for (i=0; i<_search.length; i++){
        var _resp=_search[i];
        var resp={
          "item_id":_resp.id,
          "title":_resp.title,
          "subtitle":_resp.subtitle,
          "title_cloud":esUtils.textToWordsList(_resp.title),
          "sold_count":_resp.sold_quantity,
          "state":seller_addr.state.name,
          "country":seller_addr.country.name,
          "city":seller_addr.city.name,
          "currency":_resp.currency_id,
          "price":_resp.price,
          "url":_resp.permalink,
        }

        //update metadata
        resp.search_term=this.metadata.search_term;
        resp.search_created_at=this.metadata.search_created_at;
        resp.description='toDo';

        //keep in results
        this.results.push(resp);
      }}
    }

  this.insert=function () {
      this.results.map(function(e){db.EbayES.insert_doc(e);})
  }

}

exports.response=response;
