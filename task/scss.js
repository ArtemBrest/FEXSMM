const { src, dest } = require('gulp')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const rename = require('gulp-rename')
const shorthand = require('gulp-shorthand')
const gulpCssMediaQueries = require('gulp-group-css-media-queries')
const sass = require('gulp-sass')(require('sass'))

const path = require('../config/path.js')

const scss = () => {
    return src(path.scss.src)
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: 'SCSS',
                message: error.message
            }))
        }))
        .pipe(sass({
            includePaths: ['node_modules']
        }))
        .pipe(autoprefixer())
        .pipe(shorthand())
        .pipe(gulpCssMediaQueries())
        .pipe(dest(path.scss.dest), { sourcemaps: true })
        .pipe(rename({ suffix: ".min" }))
        .pipe(csso())
        .pipe(dest(path.scss.dest), { sourcemaps: true })
}

module.exports = scss