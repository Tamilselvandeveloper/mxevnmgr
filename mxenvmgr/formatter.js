exports.formatter = function() {

    const pd = require('pretty-data').pd;
    const fs = require('fs');
    var mkdirp = require('mkdirp');

    const testFolder = './attachments/sit1_Wave2_Settlement_afx_formula/data_dictionary/CM.173/';
    const formattedfolder = './attachments/sit1_Wave2_Settlement_afx_formula/data_dictionary/CM.173_Formatted';

    mkdirp('./attachments/sit1_Wave2_Settlement_afx_formula/data_dictionary/CM.173_Formatted', function(err) {
        if (err) console.error(err)
    });

    if (fs.existsSync('./attachments/sit1_Wave2_Settlement_afx_formula/data_dictionary/CM.173/')) {
        fs.readdir(testFolder, (err, files) => {
            files.forEach(file => {
                // console.log("Formatting file %s", file);
                var unformattedText = fs.readFileSync(testFolder + '/' + file).toString();
                //console.log(unformattedText);
                let formattedText = pd.xml(unformattedText);
                // console.log(formattedText);
                console.log("Formatting file %s", file);
                let writeStream = fs.createWriteStream(formattedfolder + '/' + file);
                // console.log("Formatting file %s", file);
                writeStream.write(formattedText);
                writeStream.on('finish', () => {
                    console.log('wrote all data to file');

                });

            });
        });
        console.log('formatter');
    }
}