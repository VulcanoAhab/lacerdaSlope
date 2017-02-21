var exports=module.exports;

var db=require('./persistance.js')

var response = function () {

  this.item_detail={};

  this.metadata={};

  this.parse=function(raw_obj){
      var _resp=JSON.parse(raw_obj);
      var _item=_resp.Item;
      var description=_item.description;

      this.item_detail.description=description;
      this.item_deatil=this.metadata.detail_created_at;


  }


}
