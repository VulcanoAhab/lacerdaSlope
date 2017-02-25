var exports=module.exports;

var db=require('./persistance.js');
var lacerda=require('../lacerda/es_utils.js');

var esUtils=lacerda.esUtils;

var response = function () {

  this.item_detail={};

  this.metadata={};

  this.toUpdate={};

  this.parse=function(raw_obj){

      var _resp=JSON.parse(raw_obj);
      var _item=_resp.Item;
      var description=_item.Description;
      var detailed_date=this.metadata.detail_created_at;
      var item_id=this.metadata.item_id;
      var es_id=this.metadata.es_id;

      this.item_detail.id=item_id;
      this.item_detail.es_id=es_id;
      this.item_detail.description=description;
      this.item_detail.detail_created_at=detailed_date;



      this.toUpdate={
        "doc":{
            "description":description,
            "description_cloud":esUtils.textToWordsList(description),
            "detail_created_at":detailed_date,
              }
      }
    }


  this.update=function() {
    db.EbayES.update_doc(this.item_detail.es_id, this.toUpdate);
  }


}

exports.response=response;
