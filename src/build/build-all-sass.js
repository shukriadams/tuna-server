// Note to call this script directly your cwd must be one folder above this script's
// for relative pathing to work. Else it will not find scss files to build.

const fs = require('fs-extra'),
    minify = require('minify'),
    concatenate = require('./concatenate-css'),
    runner = require('node-sass-runner');

(async function(){
    await fs.ensureDir('./.tmp/css');
    await fs.ensureDir('./public/css');

    try {

        await runner({
            cssOutFolder : './.tmp/css',
            scssPath : './client/app/**/*.scss'
        });

        await concatenate();
        await minify('./public/css/style.css');

    } catch(ex){
        console.log(`failed with ${ex}`);
    }
})()
