'use strict';

var events = require('events');
var startedMulligan = false;

module.exports.parseLine = function parseLine(line, cb)
{
    //
    //*** INITIAL
    //
    var re = /cardId=(\S+)(?=.*\bzone from  -> FRIENDLY HAND\b)/gm;
    var res = line.match(re);
    if(res != null)
    {
        console.log("STARTED WITH CARD: " + res[0].substr(7));
        cb({
            event: "INIT",
            data: res[0].substr(7)
        });
    }

    //
    //*** ADDED CARD FROM DECK TO HAND
    ///
    var re = /cardId=(\S+)(?=.*\bFRIENDLY DECK -> \b)(?=.*\bFRIENDLY HAND\b)/gm;
    var res = line.match(re);
    if(res != null)
    {
        cb({
            event: "TAKE",
            data: res[0].substr(7)
        });
    }

    //
    //*** BEGIN MULLIGAN
    ///
    var re = /Entity=(\S+)(?=.*\btag=STEP\b)(?=.*\bvalue=BEGIN_MULLIGAN\b)/;
    var res = line.match(re);
    if(res != null)
    {
        startedMulligan = false;
    }

    //
    //*** LOADED MULLIGAN
    ///
    var re = /Entity=(\S+)(?=.*\bvalue=INPUT\b)(?=.*\btag=MULLIGAN_STATE\b)/;
    var res = line.match(re);
    if(res != null)
    {

        if(!startedMulligan)
        {
            cb({
                event: "MULLIGAN",
                data: res[0].substr(7)
            });
        }
        startedMulligan = true;
    }

    //
    //*** SELECTED HERO
    ///
    var re = /cardId=(\S+)(?=.*\bto FRIENDLY PLAY\b)(?=.*\B\(Hero\)\B)/;
    var res = line.match(re);
    if(res != null)
    {
        cb({
            event: "HERO",
            data: res[0].substr(7)
        });
    }

    //
    //*** PUT CARD BACK
    //
    var re = /cardId=(\S+)(?=.*\bFRIENDLY HAND -> \b)(?=.*\bFRIENDLY DECK\b)/gm;
    var res = line.match(re);
    if(res != null)
    {
        cb({
            event: "PUT",
            data: res[0].substr(7)
        });
    }

    //
    //*** PLAYED CARD
    //
    var re = /(cardId=(\S+))(?=.*\bplayer=1\b)(?=.*\bsrcZoneTag=HAND\b)(?=.*\bdstZoneTag=PLAY\b)/gm;
    var re2 = /(^.*\[Zone\] ZoneChangeList\.ProcessChanges\(\))/gm;
    var res = line.match(re);
    var res2 = line.match(re2);
    if(res != null && res2 != null)
    {
        cb({
            event: "PLAY",
            data: res[0].substr(7)
        });
    }


    //
    //*** GRAVEYARD
    //
    var re = /cardId=(\S+)(?=.*\bzone from  -> FRIENDLY GRAVEYARD\b)/gm;
    var res = line.match(re);
    var re2 = /cardId=(\S+)(?=.*\bzone from FRIENDLY PLAY -> FRIENDLY GRAVEYARD\b)/gm;
    var res2 = line.match(re2);
    if(res != null)
    {
        cb({
            event: "KILL",
            data: res[0].substr(7)
        });
    }
    if(res2 != null)
    {
        cb({
            event: "KILL",
            data: res2[0].substr(7)
        });
    }


    //
    // *** YOUR TURN
    //
    var re = /(\bEND waiting for zone FRIENDLY DECK\b)/gm;
    var res = line.match(re);
    if(res != null )
    {
        cb({
            event: "TURN",
            data: true
        });
    }

    //
    // *** YOUR TURN
    //
    var re = /(\bEND waiting for zone OPPOSING DECK\b)/gm;
    var res = line.match(re);
    if(res != null )
    {
        cb({
            event: "TURN",
            data: false
        });
    }

    //
    //*** WIN?
    //
    if (line.toLowerCase().indexOf('victory_screen_start')!==-1){
        cb({
            event: "WIN",
            data: ""
        });
    }

    //
    //*** LOSS :(
    //
    if (line.toLowerCase().indexOf('defeat_screen_start')!==-1){
        cb({
            event: "LOSS",
            data: ""
        });
    }
}
