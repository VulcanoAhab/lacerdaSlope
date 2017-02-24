var exports=module.exports;

var db=require('./persistance.js')

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

      var inline="ctx._source.description=";
        inline +=description+";";
        inline +="ctx._source.detail_created_at=";
        inline += detailed_date + ";";
      this.toUpdate={
        "script":{
          "inline":inline,
        }
      }
  }

  this.update=function() {
    db.EbayES.update_doc(this.item_detail.es_id, this.toUpdate);
  }


}

exports.response=response;
