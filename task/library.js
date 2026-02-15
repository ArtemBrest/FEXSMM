const { src, dest } = require('gulp')
const path = require("../config/path");

const library = () => {
    return src(path.library.src)
        .pipe(dest(path.library.dest))
}

module.exports = library
