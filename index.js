
var parser = require('./parser');


var ft = require('file-tail').startTailing("/Users/Coral/Library/Logs/Unity/Player.log");
ft.on('line',parse);

function parse(line)
{
	parser.parseLine(line, function(data){
        console.log(data);
    })
}
