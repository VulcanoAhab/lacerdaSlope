var exports = module.exports;


var persist= require('../lacerda/esPersistance.js');


var mercadoES =persist.BaseES;
mercadoES.doctype='olx';


//api
exports.mercadoES=mercadoES;
