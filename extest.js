'use strict';

var STRONK = "[Zone] ZoneChangeList.ProcessChanges() - id=4 local=False [name=Bloodfen Raptor id=21 zone=HAND zonePos=0 cardId=CS2_172 player=1] zone from FRIENDLY DECK -> FRIENDLY HAND";
var re = /cardId=(\S+)(?=.*\bFRIENDLY DECK\b)(?=.*\bFRIENDLY HAND\b)/gm;


var res = STRONK.match(re);

console.log(res[0].substr(7));
