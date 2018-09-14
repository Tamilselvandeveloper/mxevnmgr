var fs = require('fs');

var mkdirp = require('mkdirp');
var path = require('path'),
    fs = require('fs'),
    unzip = require('unzip');



if (fs.existsSync('./attachments')) {
    // console.log("file exist")

} else {
    mkdirp('./attachments', function(err) {
        if (err) console.error(err);
    });
}

var MailListener = require("mail-listener2");
var i = 0;
var mailsend;
var username = "sampletestprogram2017@gmail.com";
var password = "Infotech@20";
var mailListener = new MailListener({
    username: username,
    password: password,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX",
    markSeen: true,
    fetchUnreadOnStart: true,
    attachments: true,
    attachmentOptions: { directory: "./attachments/" }
});
mailListener.start();

mailListener.on("server:connected", function() {
    console.log("imapConnected");
});

mailListener.on("server:disconnected", function() {
    console.log("imapDisconnected");
});

mailListener.on("error", function(err) {
    console.log(err);
});

mailListener.on("mail", function(mail) {
    mailsend = 0;
    console.log(mail);

    objArray = mail.from;

    function getFields(input, field) {
        var output = [];
        for (var i = 0; i < input.length; ++i)
            output.push(input[i][field]);
        return output;
    }


    var replaymail = objArray.map(function(a) { return a.address; });
    //console.log(result);


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
            } else if (filter.test(filename)) {
                callback(filename);
            }
        }

    }
    fromDir('./attachments', /\.zip$/, function(filename) {
        //console.log('-- found:',filename);
        mailsend = 1;

        var unzip = require('./unzip.js');
        //var formatter = require('./formatter.js')

        //console.log(username)
        //console.log(password)
        var nodemailer = require('nodemailer');
        var smtpTransport = require('nodemailer-smtp-transport');

        var mailAccountUser = username;
        var mailAccountPassword = password;

        var fromEmailAddress = username;
        var toEmailAddress = replaymail;

        var transport = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: mailAccountUser,
                pass: mailAccountPassword
            }
        }))

        var mail = {
            from: fromEmailAddress,
            to: toEmailAddress,
            subject: "Replay Mail!",
            text: "We will verify your content as soon as possible....!",
            html: "<b>We will verify your content as soon as possible....!</b>"
        }

        transport.sendMail(mail, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Replay Message sent successfully to: " + toEmailAddress);
            }

            transport.close();
        });

    });

    if (mailsend == 0) {
        var nodemailer = require('nodemailer');
        var smtpTransport = require('nodemailer-smtp-transport');

        var mailAccountUser = username;
        var mailAccountPassword = password;

        var fromEmailAddress = username;
        var toEmailAddress = replaymail;
        /// -------------- the same password in primary and secondary mail -----------
        var transport = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: mailAccountUser,
                pass: mailAccountPassword
            }
        }));

        mail = {
            from: fromEmailAddress,
            to: toEmailAddress,
            subject: "Replay Mail!",
            text: "Attach the Zip file and send mail again.!",
            html: "<b>Attach the Zip file and send mail again.....!</b>"
        }

        transport.sendMail(mail, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Replay Message sent successfully to: " + toEmailAddress);
            }

            transport.close();
        });

    }

});

mailListener.on("attachment", function(attachment) {
    console.log(attachment);
});