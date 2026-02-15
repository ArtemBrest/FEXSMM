const { src, dest } = require('gulp')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const fileInclude = require('gulp-file-include')

const path = require('../config/path.js')

const html = () => {
    return src(path.html.src)
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(fileInclude())
        .pipe(dest(path.html.dest))
}

module.exports = html