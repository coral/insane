
var parser = require('./parser');
var spawn = require('child_process').spawn;
var tail = spawn('tail', ['-f','/Users/Coral/Library/Logs/Unity/Player.log']);


tail.stdout.on('data', function (data) {

var str = String(data).split('\n');

    for(var i in str)
    {
    	//console.log(str[i]);
    	temp = str[i];
        var line = temp;
        parser.parseLine('line', function(data){
            console.log(data);
        });
    }

});
