var config = require('./lib/config')('./config.json');
var parser = require('./lib/parser');
if(config.reporting)
{
    var reporting = require('./lib/reporting');
}

var ft = require('file-tail').startTailing(config.hearthstone_log_path);
ft.on('line',parse);

function parse(line)
{
    parser.parseLine(line, function(data){
        if(config.reporting)
        {
            reporting.report(data);
        }
        else
        {
            console.log(data);
        }
    })
}
