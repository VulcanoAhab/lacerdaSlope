var exports = module.exports;


var persist= require('../lacerda/esPersistance.js');


var EbayES =persist.BaseES;
EbayES.doctype='ebay';


//api
exports.EbayES=EbayES;
