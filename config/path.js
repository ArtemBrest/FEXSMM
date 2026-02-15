const { watch } = require("browser-sync")

const pathSrc = "./src"
const pathPublic = "./public"

module.exports = {
    root: pathPublic,
    html: {
        src: pathSrc + "/html/*.html",
        watch: pathSrc + "/html/**/*.html",
        dest: pathPublic
    },
    scss: {
        src: pathSrc + "/scss/*.scss",
        watch: pathSrc + "/scss/**/*.scss",
        dest: pathPublic + "/css"
    },
    js: {
        src: pathSrc + "/js/*.js",
        watch: pathSrc + "/js/**/*.js",
        dest: pathPublic + "/js"
    },
    img: {
        src: pathSrc + "/img/**/*.{png,jpg,jpeg,gif,svg,webp,ico}",
        watch: pathSrc + "/img/**/*.{png,jpg,jpeg,gif,svg,webp,ico}",
        dest: pathPublic + "/img"
    },
    font: {
        src: pathSrc + "/font/*.{ttf,eot,woff,woff2,otf,otc,ttc,svg}",
        watch: pathSrc + "/font/**/*.{ttf,eot,woff,woff2,otf,otc,ttc,svg}",
        dest: pathPublic + "/font"
    },
    library: {
        src: pathSrc + "/library/**/*.{css,js,git,svg,ttf,woff,woff2,css}",
        watch: pathSrc + "/library/**/*.{css,js,git,svg,ttf,woff,woff2,css}",
        dest: pathPublic + "/library"
    }
}
