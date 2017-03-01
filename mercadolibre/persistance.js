var exports = module.exports;


var persist= require('../lacerda/esPersistance.js');


var mercadoES =persist.BaseES;
mercadoES.doctype='mercadolibre';


//api
exports.mercadoES=mercadoES;
