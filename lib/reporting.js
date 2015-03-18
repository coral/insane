var config = require('./lib/config')('./config.json');
var socket = require('socket.io-client')('http://'+config.reporting_ip+':'+config.reporting_port);

socket.on('connect', function(){

});

module.exports.report = function (data){

	socket.emit("client-report", {computer: config.computer, data: data});

}


