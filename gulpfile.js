//list dependences
const { src, dest, watch, series, task } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const webp = require('gulp-webp');
const nunjucksRender = require('gulp-nunjucks-render');
const ghPages = require('gulp-gh-pages');

//create function

//deploy
task('deploy', function () {
  return src('./dist/**/*').pipe(ghPages());
});

//html
function htmlTemplate() {
  return src('src/templates/pages/**/*.{html,njk}')
    .pipe(nunjucksRender({ path: ['src/templates/components'] }))
    .pipe(dest('dist'));
}
//scss
function compilescss() {
  return src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(prefix('last 2 versions'))
    .pipe(minify())
    .pipe(dest('dist/assets/css'));
}

//web images
function webpImage() {
  return src('src/images/*.{jpg,png}').pipe(webp()).pipe(dest('dist/assets/images'));
}

function images() {
  return src('src/images/*.webp').pipe(dest('dist/assets/images'));
}

//svg
function svgCopy() {
  return src('src/icons/*.svg').pipe(dest('dist/assets/icons'));
}

//create watch task
function watchTask() {
  watch('src/templates/**/**/*.{html,njk}', htmlTemplate);
  watch('src/scss/**/*.scss', compilescss);
  watch('src/images/*.{jpg,png}', webpImage);
  watch('src/images/*.webp', images);
  watch('src/icons/*.svg', svgCopy);
}

//default gulp
exports.default = series(htmlTemplate, compilescss, webpImage, images, svgCopy, watchTask);
