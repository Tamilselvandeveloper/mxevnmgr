var path = require('path'),
    fs = require('fs'),
    unzip = require('unzip');
var extract = require('extract-zip');

const timeoutObj = setInterval(function() { myTimer(); }, 400);

function myTimer() {
    function fromDir(startPath, filter, callback) {

        if (!fs.existsSync(startPath)) {
            console.log("no dir ", startPath);
            return;
        }

        var files = fs.readdirSync(startPath);
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(startPath, files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()) {
                fromDir(filename, filter, callback);
            } else if (filter.test(filename)) callback(filename);
        };

    };
    fromDir('/Users/kumars/Desktop/mainproject/attachments/', /\.zip$/, function(filename) {
        //console.log('-- found:', filename);

        extract(filename, { dir: filename.slice(0, filename.lastIndexOf("/")) }, function(err) {
                var formatter = require('./formatter.js').formatter;
                formatter();
                fs.unlink(filename, function(err) {
                    if (err) console.log(err);
                });
                //console.log("completed..");
            })
            // fs.createReadStream(filename).pipe(unzip.Extract({ path:  filename.slice(0, filename.lastIndexOf("/"))   }));
    });
}

function myStopFunction() {
    clearInterval(timeoutObj);
}