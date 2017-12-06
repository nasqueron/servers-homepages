#!/usr/bin/env node

/*  -------------------------------------------------------------
    Servers homepages
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    Project:        Nasqueron
    Licence:        BSD-2-Clause
    Description:    Generate index.html homepage for Nasqueron
                    servers from a generic template and specific
                    servers data.
    -------------------------------------------------------------    */

const fs = require('fs');
const path = require('path');
const AutoLinker = require('autolinker');

/*  -------------------------------------------------------------
    Handle arguments
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -    */

if (process.argv.length < 3) {
    var scriptName = path.basename(process.argv[1]);
    console.error(`Usage: ${scriptName} <server name>`);
    process.exit(1);
}

var serverFile = __dirname + '/servers/' + process.argv[2] + ".json";

if (!fs.existsSync(serverFile)) {
    console.error(`Can't found ${serverFile}`);
    process.exit(2);
}

var serverData = require(serverFile);

/*  -------------------------------------------------------------
    Helper functions
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -    */

var autolinker = new AutoLinker({
    newWindow: false,
});

serverData.getLineTitle = function (entry) {
    return entry[0];
}

serverData.getLineEntries = function (entry) {
    var entries;
    if (typeof entry[1] === 'string') {
        entries = [entry[1]];
    } else {
        entries = entry[1];
    }

    return entries.map(text => function (text) {
        return autolinker.link(text);
    });
}

/*  -------------------------------------------------------------
    Render template
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -    */

require('ect')({
    root: __dirname + '/templates',
    ext: '.ect',
}).render(
    'index',
    serverData,
    function (error, html) {
        if (error) {
            console.error(error);
        }

        if (html) {
            console.log(html);
        }
    }
);
