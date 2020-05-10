const fileconcat = require('fileconcat'),
    fs = require('fs-extra');

module.exports = async function conc(){
    return new Promise(async function(resolve, reject){
        try {
            await fs.ensureDir('./public/css');

            fileconcat(['./.tmp/css/**/*.css'], './public/css/style.css').then(() => {
                resolve();
            })
        } catch(ex){
            resolve(ex);
        }
    })
}
