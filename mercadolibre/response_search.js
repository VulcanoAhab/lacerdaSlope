var exports = module.exports;

var lacerda=require('../lacerda/es_utils.js');
var db=require('./persistance.js')
var esUtils=lacerda.esUtils;

var build_payments=function(response){
  var payments=[];
  if (response.accepts_mercadopago){
    payments.push('MercadoPago');
  }
  if (response.non_mercado_pago_payment_methods){
    var pays=response.non_mercado_pago_payment_methods;
    for (i=0; i<pays.length; i++) {
      var p=pays[i];
      payments.push(p);
    }
  }
  return payments;
}

var build_descriptions=function(response){
  var dis=[];
  if (response.descriptions){
    var ds=response.descriptions;
    for (i=0;i<ds.length;i++){
      var d=ds[i];
      dis.push(d.id);
    }
  }
  return dis;
}


var response = function () {

  this.results=[];

  this.metadata={};

  this.parse=function(raw_response){

    var _response=JSON.parse(raw_response);
    var _search=_response.results;

    var offset=_response.paging.offset;
    var limit=_response.paging.limit;

    var item_count=_response.paging.total;
    var search_results=[];

    console.log('TOTAL', item_count, typeof item_count);

    if (item_count>0) {
      for (i=0; i<_search.length; i++){

        var _resp=_search[i];
        var seller_addr=_resp.seller_address;

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
          "location":seller_addr.country.name,
          "payment":build_payments(_resp),
          "descriptions_ids":build_descriptions(_resp)
        }

        //update values
        resp.search_term=this.metadata.search_term;
        resp.search_created_at=this.metadata.search_created_at;
        resp.description='toDo';
        resp.page=offset/limit;

        this.metadata.offset=offset;
        this.metadata.limit=limit;
        this.metadata.item_count=item_count;

        //keep in results
        this.results.push(resp);
      }}
    }

  this.insert=function () {
      this.results.map(function(e){db.mercadoES.insert_doc(e);})
  }

}

exports.response=response;
