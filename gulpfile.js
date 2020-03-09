("use strict");
const gulp = require("gulp");

//Modules
const uglify = require("gulp-uglify"); //optimise JS
const rename = require("gulp-rename"); //used to rename output file eg add .min for minified version

const less = require("gulp-less"); //used to convert LESS partial files into output CSS
const path = require("path"); //dependency of gulp-less (two are needed together)
const sourcemaps = require("gulp-sourcemaps"); //this adds sourcemaps so we can see which partial files our styles come from

const postcss = require("gulp-postcss"); //parent for cssnano and autoprefixer
const cssnano = require("cssnano"); //optimise css
const autoprefixer = require("autoprefixer"); //handle browser prefixes

const babel = require("gulp-babel"); //enable use of next generation JavaScript

//Variables
const srcLess = "dev/less/";
const srcJS = "dev/js/";
const destLocal = "dev/";
const dist = "dist/";
const autoprefixerOptions = {
  browsers: ["last 3 versions", "> 3%", "Firefox ESR"]
};

// Compile CSS from LESS files
gulp.task("less", function() {
  return gulp
    .src(srcLess + "*.less")
    .pipe(sourcemaps.init())
    .pipe(
      less().on("error", function(err) {
        console.log(err);
      })
    )
    .pipe(gulp.dest(destLocal + "css/")) //compile to dev css folder
    .pipe(postcss([autoprefixer(autoprefixerOptions), cssnano()])) //optimise and add vendor prefixes
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(dist + "css/")); //compile to dist
});

// Compile/optimise JS
gulp.task("scripts", function() {
  return gulp
    .src(srcJS + "**/*.js")
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(dist + "scripts/")); //compile to dist
});

// Watch for changes in files
gulp.task("watch", function() {
  // Watch .js files
  gulp.watch(srcJS + "**/*.js", gulp.parallel("scripts"));

  // Watch .less files
  gulp.watch(srcLess + "**/*.less", gulp.parallel("less"));
});

// Default Task
gulp.task(
  "default",
  gulp.series("less", "watch", function() {
    console.log("CSS has been published");
  })
);
