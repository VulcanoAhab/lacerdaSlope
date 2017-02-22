var exports=module.exports;

var db=require('./persistance.js')

var response = function () {

  this.item_detail={};

  this.metadata={};

  this.toUpdate={};

  this.parse=function(raw_obj){
      var _resp=JSON.parse(raw_obj);
      var _item=_resp.Item;
      var description=_item.description;
      var detailed_date=this.metadata.detail_created_at;

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
    db.EbayES.update_doc(this.toUpdate);
  }


}
