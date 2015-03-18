'use strict';
	var fs = require('fs');
	function HearthStoneLogger(){
		var that = {},
		configFile = 'log.config',
		getDataLocation = function(){
			//return 'C:/Program Files (x86)/Hearthstone/Hearthstone_Data/output_log.txt';
			return  '/Users/Coral/Library/Logs/Unity/Player.log'
		},
		getConfigLocation = function(){
			return '/Users/Coral/Library/Preferences/Blizzard/Hearthstone/'+configFile;
		},
		configExist = function(){
			return fs.existsSync(getConfigLocation());
		},
		createConfig = function(callback){
			if (configExist()) return;
			fs.renameSync(process.cwd()+'/'+configFile, getConfigLocation());
		},
		parseEvents = function(line){
			if (line.toLowerCase().indexOf('victory_screen_start')!==-1){
				console.log('yo win yourself a horse');
			}
			if (line.toLowerCase().indexOf('defeat_screen_start')!==-1){
				console.log('yo lost yo game');
			}

			//*** ADDED CARD FROM DECK TO HAND
			var re = /cardId=(\S+)(?=.*\bFRIENDLY DECK -> \b)(?=.*\bFRIENDLY HAND\b)/gm;
			var res = line.match(re);
			if(res != null)
			{
				console.log(res[0].substr(7));
			}

			//*** STARTED WITH
			//
			//
			var re = /cardId=(\S+)(?=.*\bzone from\b)(?=.*\bFRIENDLY HAND\b)/gm;
			var res = line.match(re);
			if(res != null)
			{
				console.log(res[0].substr(7));
			}
			//console.log(line);
		},
		monitorChanges = function(){
			var ft = require('file-tail').startTailing(getDataLocation());
			ft.on('line',parseEvents);
		}
		;
		that.monitorChanges = monitorChanges;
		that.createConfig = createConfig;
		return that;
	}
	var hearth = new HearthStoneLogger();
	hearth.createConfig();
	hearth.monitorChanges();
