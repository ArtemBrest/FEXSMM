const { src, dest } = require('gulp')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const imagemin = require('gulp-imagemin');
const imgCompress  = require('imagemin-jpeg-recompress');
const newer = require('gulp-newer')


const path = require('../config/path.js')

const img = () => {
    console.log(path.img.src);
    return src(path.img.src)
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: 'Image',
                message: error.message
            }))
        }))
        .pipe(newer(path.img.dest))
        /*.pipe(imagemin({
             verbose: true
        }))*/
        /*.pipe(imagemin([
            imgCompress({
                loops: 4,
                min: 70,
                max: 80,
                quality: 'high'
            }),
            //imagemin.gifsicle(),
            //imagemin.optipng(),
            //imagemin.svgo()
        ]))*/
        .pipe(dest(path.img.dest))
}

module.exports = img
