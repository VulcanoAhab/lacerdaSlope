var exports = module.exports;

var _index='lacerda';

var esUtils = {

  index:_index,

  //ensures index exists and count
  test_lacerda : function (client, doctype) {


    var ebay_index={index: _index, type: doctype};

    try {
      client.count(ebay_index, function(err,resp,status) {
        if(err) {
          if (err.message.indexOf('index_not_found_exception') > 0){
            console.log("(•) CREATING INDEX");
            client.indices.create({
              index: 'lacerda'
              },function(err,resp,status) {
              console.log("(•) DONE CREATING INDEX",resp);
             });
           } else  {
             console.log("(••) FAIL TO CREAT INDEX", err);
           }
        } else {
          console.log("(•) Index [",_index ,
                      "] doctype [",doctype, "] is on: ",
                      resp.count, " docs")
        }
      });
    } catch (err){
      console.log("(••) FAIL: ", err.message);
    }
  },

  time_id:function(ob_id){

    var datis=new Date(new Date().getTime())
    var day=datis.getDate();
    var month=datis.getMonth()+1;
    var year=datis.getFullYear();
    var string_datis=day+"-"+month+"-"+year;
    return ob_id+"___"+string_datis

  },

  delete_all_byType:function(client, index, doctype) {
    client.deleteByQuery({
      'index':index,
      'type':doctype,
      'body':{'query':{'match_all':{}}}}),
      function(err,resp,status) {
        console.log("delete",resp);
      }
  },

  textToWordsList: function(text) {
    var new_text=text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    var to_list=new_text.replace(/\s{2,}/g," ");
    var words=to_list.split(" ").filter(
      function(word){return word.length > 3;});
    return words;
  },

  paging_url:function(url, next_page_number, rex_string){
    var pattern=rex_string+"(\\d+)";
    var _rex=new RegExp(pattern);
    var rex_res=_rex.exec(url);
    if((!rex_res) || (!rex_res[1]) || (rex_res[1] >= next_page_number)) {
      return 'end';
    }
    var to_replace=rex_res[0];
    var new_value=rex_string+next_page_number;
    var new_url=url.replace(to_replace, new_value);
    return new_url;
  }

}

exports.esUtils=esUtils;
