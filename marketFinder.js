const commandLineArgs = require('command-line-args');
var mercadoSearch=require("./mercadolibre/search.js");

const optionDefinitions = [
  { name: 'mercadoLibre', alias: 'e', type: Boolean, defaultOption: true },
  { name: 'olx',  alias: 'x', type: Boolean, defaultOption: false }
]

const options = commandLineArgs(optionDefinitions)

if options.mercadoLibre {
  var ms=new mercadoSearch.mSearch();
  ms.mount_urls();
  ms.search_many();
}
