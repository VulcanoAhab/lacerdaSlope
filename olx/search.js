var exports=module.exports;

// == imports
var Horseman = require('node-horseman');
var fs = require('fs');
var mconfigs=require('./configs.json');
var db=require('./persistance.js')
var esLacerda=require('../lacerda/es_utils.js');
var esUtils=esLacerda.esUtils;


// ============== helper functions ====== ugly, will be improved
var Helpers = {

  extractPageNumber: function (urlIn){
    var re=/o=(\d+)/i;
    var stringNumber=urlIn.match(re);
    if (!stringNumber || !stringNumber.length){return 0}
    var number=Number(stringNumber[1]);
    if (!number){return 0;}
    return number
  },

  extractPrice: function (priceRawString) {
    if (!priceRawString){return 0;}
    var elclean=priceRawString.replace("R$","");
    if (!elclean){return 0}
    var price=Number(elclean.trim());
    if (!price){return 0;}
    return price
  },

  extractRegion: function (stringAdrr) {
    var baseDict={"city":"notDetected","state":"notDetected"};
    var listCityState=stringAdrr.split("-");
    if (!listCityState || !listCityState.length || listCityState[0]){return baseDict;}
    var rawCity=listCityState[0].trim("\t");
    if (rawCity){
      baseDict["city"]=rawCity.trim();
    }
    if (listCityState[1]){
      var rawState=listCityState[1].trim("\t");
      if (rawState){
        baseDict["state"]=rawState.trim();
      }}
    return baseDict;
  },

  extractDateTime: function (datisDict) {
    var monthDict={
      "Jan":1,
      "Fev":2,
      "Mar":3,
      "Abr":4,
      "Jun":5,
      "Jul":6,
      "Ago":8,
      "Set":9,
      "Out":10,
      "Nov":11,
      "Dez":12,

    }
    var todayNames=["hoje", "hoy"];
    var yesterdayNames=["ontem", "ayer"]

    var today=new Date()
    var elDate=datisDict.date;
    if (!elDate){return null}
    //do date
    elDate=elDate.trim()
    if (todayNames.indexOf(elDate.toLowerCase())){
      var day=today.getDate();
      var month=today.getMonth();
    } if(yesterdayNames.indexOf(elDate.toLowerCase())) {
      var tods=today.getDate();
      if (tods == 1){
        var day=30; //just for testing ** fix it!
        var month=today.getMonth()-1;
      } else {
        var day=tods-1
        var month=today.getMonth()
      }} else {
      var dM=elDate.split(" ");
      if (!dM || !dM.length || !dM[1]){return null}
      var elMonth=dM[1].trim();
      var month=monthDict[elMonth];
      if (dM[0]){
        var day=dM[0].trim();
      } else {
        var day=null; //not good * fix it
      }
    }
    //couldn't go back a year yet - dont know how they display with year
    var year=today.getFullYear();
    // do time
    var inTime=datisDict.time;
    if (!inTime){
      hour=0
      minute=0
    }
    var times=inTime.split(":");
    if (!times || !times.length || !times[0] || !times[1]){
      var hour=0;
      var minute=0;
    } else {
      var hour=times[0].trim();
      var minute=times[1].trim();
    }
    return new Date(year, month, day, hour, minute);
  }

}
// ============== helper functions ======

var oSearch = function () {
  //search globals
  this.requests_list=[];
  this.configs=mconfigs;
  this.bases={
    "brazil":function(term, pageNumber) {
      _url="http://www.olx.com.br/brasil?o="
      _url+=pageNumber
      _url+="&ot=1&q="+term
      return _url}}
  //mount requests
  this.mountRequest=function(keyword, country_name, pageNumber) {
    _buildUrl=this.bases[country_name.toLowerCase()];
    _url=_buildUrl(keyword, pageNumber)
    return {"url":_url,
            "search_term":keyword,
            "country":country_name,
            "pageNumber":pageNumber}
  };

  this.addRequest=function(keyword, country_name, pageNumber){
    var url=this.mountRequest(keyword, country_name, pageNumber);
    this.requests_list.push(url);
  }

  this.mountRequests=function () {
    var ilimit=mconfigs.keywords.length;
    //var ilimit=2;
    for (i=0; i<ilimit; i++){
      var keyword=mconfigs.keywords[i];
      var jlimit=mconfigs.countries.length;
      //var jlimit=2;
      for (j=0; j<jlimit;j++){
        var country=mconfigs.countries[j];
          this.addRequest(keyword, country, 1);
      }
    }
  }


  this.search=function(requestDict) {
    //init var
    var that=this;
    var horseman = new Horseman();
    var datis=new Date(new Date().getTime()).toString();
    var _url=requestDict.url;
    // response obj
    rObj={"metadata":{}, "results":[], "error":{}};
    rObj.metadata.search_term=requestDict.search_term;
    rObj.metadata.search_created_at=datis;
    rObj.metadata.country=requestDict.country;
    rObj.metadata.page=Helpers.extractPageNumber(_url);
    //   fetch
    console.log("\t[+] GET: ", _url)
    horseman
      .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
      .open(_url)
      .log("\t[+]GOT: "+_url)
      //.waitForSelector('a[title="Última página"]')
      .evaluate(function(resp) {
          //Page-Global values
          var lastis=$('a[title="Última página"]');
          if (lastis && lastis[0]){
            resp.metadata.lastUrl=lastis[0].href;
            } else {
            resp.metadata.lastUrl="last";
          }
          var elements=document.getElementsByClassName('OLXad-list-link');
          var item_count=elements.length

          if (item_count>0) {
            //grabbers functions
            function grabPrice(el) {
              var elnObj=el.getElementsByClassName("OLXad-list-price");
              if (!elnObj || !elnObj.length){return "";}
              var eln=elnObj[0].textContent;
              return eln
            }

            function grabRegion(el){
              var elAdrrObj=el.getElementsByClassName("text detail-region");
              if (!elAdrrObj || !elAdrrObj.length) {return "";}
              var elAdrr=elAdrrObj[0].textContent;
              return elAdrr
            }

            function grabDateTime(el){
              baseDict={"time":null, "date":null}
              var elDateObj=el.getElementsByClassName("text mb5px");
              if (elDateObj && elDateObj.length){
                if (elDateObj[0]){
                  baseDict["date"]=elDateObj[0].textContent
                }
                if (elDateObj[1]){
                  baseDict["time"]=elDateObj[1].textContent
                }
              }
              return baseDict
            }
            //Element values
            for (i=0; i<elements.length; i++){
              var el=elements[i];
              var price=grabPrice(el);
              var region=grabRegion(el);
              var dateTime=grabDateTime(el);
              var title=el.getAttribute("title");
              var targetUrl=el.getAttribute("href");
              if (!targetUrl.indexOf("olx.com")){continue}
              resp.results.push({
                        "item_id":el.getAttribute("id"),
                        "url":targetUrl,
                        "price":price,
                        "region":region,
                        "created_at":dateTime,
                        "title":title})}} else {
              console.log("[-] No results for: ", targetUrl)}
        return resp;}, rObj)
      //map => last tranforms and save
      .then (function(rObj) {
        //set vals
        _limit=Helpers.extractPageNumber(rObj.metadata.lastUrl);
        _search_term=rObj.metadata.search_term;
        _country=rObj.metadata.country;
        _page=rObj.metadata.page;
        //transform elements
        rObj.results.map(function(e){
          //location
          var region=e["region"];
          delete e["region"];
          region=Helpers.extractRegion(region);
          e.city=region.city;
          e.state=region.state;
          e.country=_country;
          e.location=_country;
          //price
          e.price=Helpers.extractPrice(e.price);
          //dateTime
          e.created_at=Helpers.extractDateTime(e.created_at);
          //wordcloud
          e.title_cloud=esUtils.textToWordsList(e.title);
          //metadata
          e.search_term=_search_term;
          e.search_created_at=rObj.metadata.search_created_at;
          e.description='toDo';
          e.page=_page;
          //save element
          db.mercadoES.insert_doc(e)});
        // paging
        if (_page<_limit){
            requestDict=that.mountRequest(_search_term, _country, _page+1);
            console.log("[+] PAGGING: ", requestDict.url)
            horseman.close()
            that.search(requestDict);
        } else {
          console.log("[+] ENDING: ",_page, _limit);
          return horseman.close();
        }
      })
      .catch(function(e) {
        console.log("[-] FAIL ", e)
      });
  }

  this.search_many=function () {
     this.requests_list.map( function(e) {
      this.search(e)}, this)}


}

var olxis=new oSearch();
olxis.mountRequests();
olxis.search_many();

//exports.oSearch=oSearch
