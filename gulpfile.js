/**
 * Gulpfile.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Sass to CSS conversion, error catching, Autoprefixing, Sourcemaps,
 *         CSS minification, and Merge Media Queries.
 *      3. JS: Concatenates & uglifies Vendor and Custom JS files.
 *      4. Images: Minifies PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or JS.
 *      6. Watches files for changes in PHP.
 *      7. Corrects the line endings.
 *      8. InjectCSS instead of browser page reload.
 *
 * @author mawrhis (@mawrhis)
 * @version 1.0.0
 */

/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 */

// START Editing Project Variables.
// Project related.
var project                 = 'jpcz'; // Project Name
var projectURL              = 'localhost:1313'; // Project URL - Something like localhost:8888
var productURL              = './'; // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.

// Style related.
var styleSource              = 'assets/scss/style.scss'; // Path to main .scss file.
var styleDestination         = 'static/css'; // Path to place the compiled CSS file.

// JS Vendor related.
//var jsVendorSource           = './assets/js/vendors/*.js'; // Path to JS vendor folder.
//var jsVendorDestination     = './dist/js/'; // Path to place the compiled JS vendors file.
//var jsVendorFile            = 'vendors'; // Compiled JS vendors file name.
// Default set to vendors i.e. vendors.js.

// JS Custom related.
//var jsCustomSource          = './assets/js/custom/*.js'; // Path to JS custom scripts folder.
//var jsCustomDestination     = './dist/js/'; // Path to place the compiled JS custom scripts file.
//var jsCustomFile            = 'custom'; // Compiled JS custom file name.
// Default set to custom i.e. custom.js.

// Images related.
var imagesSource            = 'assets/img/**/*.{png,jpg,gif,svg}'; // Source folder of images which should be optimized.
var imagesDestination       = 'static/img'; // Destination folder of optimized images. Must be different from the imagesSource folder.

// Watch files paths.
var styleWatchFiles         = 'assets/scss/**/*.scss'; // Path to all *.scss files inside css folder and inside them.
//var vendorJSWatchFiles      = 'assets/js/vendor/*.js'; // Path to all vendor JS files.
//var customJSWatchFiles      = 'assets/js/custom/*.js'; // Path to all custom JS files.
//var projectPHPWatchFiles    = './**/*.php'; // Path to all PHP files.


// Browsers you care about for autoprefixing.
// Browserlist https        ://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];

// STOP Editing Project Variables.

/**
 * Load Plugins.
 *
 * Load gulp plugins and assing them semantic names.
 */
var gulp         = require('gulp'); // Gulp of-course

// CSS related plugins.
var sass         = require('gulp-sass'); // Gulp pluign for Sass compilation.
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.
var mmq          = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.

// JS related plugins.
var concat       = require('gulp-concat'); // Concatenates JS files
var uglify       = require('gulp-uglify'); // Minifies JS files

// Image realted plugins.
var imagemin     = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Utility related plugins.
var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var lineec       = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload       = browserSync.reload; // For manual browser reload.
var cssnano      = require('gulp-cssnano');
var gulpCopy     = require('gulp-copy');

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may define a custom port
 *    4. You may want to stop the browser from openning automatically
 */
gulp.task( 'browser-sync', function() {
  browserSync.init( {

    // For more options
    // @link http://www.browsersync.io/docs/options/

    // Project URL.
    proxy: projectURL,

    // `true` Automatically open the browser with BrowserSync live server.
    // `false` Stop the browser from automatically opening.
    open: true,

    // Inject CSS changes.
    // Commnet it to reload browser for every CSS change.
    injectChanges: true,

    // Use a specific port (instead of the one auto-detected by Browsersync).
    // port: 7000,

  } );
});


/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
 gulp.task('styles', function () {
    gulp.src( styleSource )
    .pipe( sourcemaps.init() )
    .pipe(sass().on('error', sass.logError))
    .pipe( sourcemaps.write ( "/" ) )
    .pipe( gulp.dest( styleDestination ) )

    // .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    // .pipe( mmq( { log: true } ) ) // Merge Media Queries only for .min.css version.

    .pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.

    // .pipe( rename( { suffix: '.min' } ) )
    // .pipe( minifycss( {
    //   maxLineLen: 10
    // }))
    // .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    // .pipe( gulp.dest( styleDestination ) )
    //
    // .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    // .pipe( browserSync.stream() )// Reloads style.min.css if that is enqueued.
    //.pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) )
 });

 gulp.task('styles:prod', function () {
    gulp.src( styleSource )
    .pipe( sourcemaps.init() )
    .pipe(sass().on('error', sass.logError))
    .pipe( sourcemaps.write ( styleDestination ) )
    .pipe( gulp.dest( styleDestination ) )
    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files

    .pipe(cssnano())
    //   maxLineLen: 10
    // }))
    // .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( styleDestination ) )
    //
    // .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    // .pipe( browserSync.stream() )// Reloads style.min.css if that is enqueued.
    //.pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) )
 });


 /**
  * Task: `vendorJS`.
  *
  * Concatenate and uglify vendor JS scripts.
  *
  * This task does the following:
  *     1. Gets the source folder for JS vendor files
  *     2. Concatenates all the files and generates vendors.js
  *     3. Renames the JS file with suffix .min.js
  *     4. Uglifes/Minifies the JS file and generates vendors.min.js
  */
 gulp.task( 'vendorsJs', function() {
  gulp.src( jsVendorSource )
    .pipe( concat( jsVendorFile + '.js' ) )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsVendorDestination ) )
    .pipe( rename( {
      basename: jsVendorFile,
      suffix: '.min'
    }))
    .pipe( uglify() )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsVendorDestination ) )
    //.pipe( notify( { message: 'TASK: "vendorsJs" Completed! 💯', onLast: true } ) );
 });


 /**
  * Task: `customJS`.
  *
  * Concatenate and uglify custom JS scripts.
  *
  * This task does the following:
  *     1. Gets the source folder for JS custom files
  *     2. Concatenates all the files and generates custom.js
  *     3. Renames the JS file with suffix .min.js
  *     4. Uglifes/Minifies the JS file and generates custom.min.js
  */
 gulp.task( 'customJS', function() {
    gulp.src( jsCustomSource )
    .pipe( concat( jsCustomFile + '.js' ) )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsCustomDestination ) )
    .pipe( rename( {
      basename: jsCustomFile,
      suffix: '.min'
    }))
    .pipe( uglify() )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( jsCustomDestination ) )
    //.pipe( notify( { message: 'TASK: "customJs" Completed! 💯', onLast: true } ) );
 });


 /**
  * Task: `images`.
  *
  * Minifies PNG, JPEG, GIF and SVG images.
  *
  * This task does the following:
  *     1. Gets the source of images raw folder
  *     2. Minifies PNG, JPEG, GIF and SVG images
  *     3. Generates and saves the optimized images
  *
  * This task will run only once, if you want to run it
  * again, do it with the command `gulp images`.
  */
 gulp.task( 'images', function() {
  gulp.src( imagesSource )
    .pipe( imagemin( {
          progressive: true,
          optimizationLevel: 3, // 0-7 low-high
          interlaced: true,
          svgoPlugins: [{
            removeViewBox: false,
            removeDimensions: true,
            cleanupIDs: true,
            cleanupAttrs: true,
            removeDesc: true,
            removeUselessDefs: true
          }]
        } ) )
    .pipe(gulp.dest( imagesDestination ))
    //.pipe( notify( { message: 'TASK: "images" Completed! 💯', onLast: true } ) );
 });


 gulp.task( 'copy', function () {

   //Bootstrap
   //gulp.src('node_modules/bootstrap/scss/**/*')
     //.pipe(gulp.dest('assets/scss/vendor/bootstrap'));
   //Sass-mg
   //Sass-mg
   //gulp.Source('node_modules/sass-mq/_mq.scss')
     //.pipe(gulp.dest('assets/scss/vendor/'));
   //Fonts
  //  gulp.Source('./assets/fonts/*')
  //    .pipe(gulp.dest('./dist/fonts/'));



 });





 /**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */
 gulp.task( 'default', ['copy', 'styles', 'images'], function () {
  //gulp.watch( projectPHPWatchFiles, reload ); // Reload on PHP file changes.
  gulp.watch( styleWatchFiles, [ 'styles' ] ); // Reload on SCSS file changes.
  //gulp.watch( vendorJSWatchFiles, [ 'vendorsJs', reload ] ); // Reload on vendorsJs file changes.
  //gulp.watch( customJSWatchFiles, [ 'customJS', reload ] ); // Reload on customJS file changes.
 });

 gulp.task( 'build', ['copy', 'styles:prod', 'vendorsJs', 'customJS', 'images'], function () {
 });