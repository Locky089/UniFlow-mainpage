const {src, dest, series, parallel, watch, lastRun} = require('gulp')
const sass             = require('gulp-sass')(require('sass'))
const cleanCSS         = require('gulp-clean-css')
const autoprefixer     = require('gulp-autoprefixer')
const gcmq             = require('gulp-group-css-media-queries')
const sourcemaps       = require('gulp-sourcemaps')
const tinypng          = require('gulp-tinypng-compress')
const svgSprite        = require('gulp-svg-sprite')
const imagemin         = require('gulp-imagemin')
const webpConvert      = require('imagemin-webp')
const pug              = require('gulp-pug')
const htmlmin          = require('gulp-htmlmin')
const webpackStream    = require('webpack-stream')
const uglify           = require('gulp-uglify-es').default
const del              = require('del')
const browserSync      = require('browser-sync').create()
const rev              = require('gulp-rev')
const revRewrite       = require('gulp-rev-rewrite')
const revDel           = require('gulp-rev-delete-original')
const rename           = require('gulp-rename')
const gulpif           = require('gulp-if')
const notify           = require('gulp-notify')
const { readFileSync } = require('fs')
const newer            = require('gulp-newer')
const remember         = require('gulp-remember')
const replace          = require('gulp-replace')
const plumber          = require('gulp-plumber')


// === ИСПРАВЛЕНО: ДИНАМИЧЕСКИЙ РЕЖИМ ===
const isDevelopment = process.argv.includes('--dev') || process.argv.includes('dev');


const svgSprites = () => {
  return src('src/assets/_sprite/**/*.svg') 
    .pipe(plumber({
      errorHandler: notify.onError({
        title: 'SVG Sprite Error',
        message: '<%= error.message %>'
      })
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg', 
          example: isDevelopment
        }
      },
      shape: {
        transform: [
          {
            svgo: {
              plugins: [
                {
                  name: 'removeAttrs',
                  params: {
                    attrs: ['class', 'fill', 'stroke.*'] 
                  }
                },
                {
                  name: 'removeXMLNS',
                  active: true
                },
                {
                  name: 'removeXMLProcInst',
                  active: true
                }
              ]
            }
          }
        ]
      },
      svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
      }
    }))

    .pipe(replace('<?xml version="1.0" encoding="utf-8"?>', ''))
    .pipe(dest('app/img/sprite/')); 
};

const svgSpritesAssets = () => {
  return src('src/assets/img/sprite/*.svg')
    .pipe(dest('app/img/sprite/'))
}

const clean = () => {
	return del(['app/*'])
}

const fontsAssets = () => {
	return src('src/assets/fonts/*')
		.pipe(dest('app/fonts/'))
}

const html = () => {
  return src('src/components/*.pug', {since: lastRun(html)})
    .pipe(remember('html'))
    .pipe(plumber({
      errorHandler: notify.onError({
        title: 'Pug Error',
        message: '<%= error.message %>'
      })
    }))
    .pipe(pug({pretty: true}))
    .pipe(dest('app'))
    .pipe(browserSync.stream());
};

const styles = () => {
    return src('src/styles/style.sass')
        .pipe(gulpif(isDevelopment, sourcemaps.init()))
        .pipe(sass())
        .pipe(gulpif(!isDevelopment, gcmq()))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(!isDevelopment, cleanCSS({
            level: 2
        })))
        .pipe(gulpif(isDevelopment, sourcemaps.write('.')))
        .pipe(dest('app/styles'))
        .pipe(browserSync.stream())
};

const scripts = () => {
	return src('src/assets/js/main.js')
    .pipe(webpackStream({
      mode: isDevelopment ? 'development' : 'production',
      output: {
        filename: 'main.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          }
        ]
      }
    }))
    .pipe(gulpif(isDevelopment, sourcemaps.init()))
    .pipe(gulpif(!isDevelopment, uglify().on("error", notify.onError())))
    .pipe(gulpif(isDevelopment, sourcemaps.write('.')))
    .pipe(dest('./app/js'))
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./app'))
}


// === ИСПРАВЛЕНО: ИЗОБРАЖЕНИЯ — КОПИРУЮТ ВСЁ, ВКЛЮЧАЯ .WEBP ===
const images = () => {
  return src('src/assets/img/**/*.{png,jpg,jpeg,svg,webp}', { since: lastRun(images) })
    .pipe(newer('app/img'))
    .pipe(dest('app/img'));
};

// === DEV: СОЗДАНИЕ .WEBP В SRC (при добавлении .webp/.png) ===
const createWebpInSrc = (done) => {
  if (!isDevelopment) return done();

  return src('src/assets/img/**/*.{png,jpg,jpeg}')
    .pipe(newer({ dest: 'src/assets/img', ext: '.webp' }))
    .pipe(imagemin([webpConvert({ quality: 95 })]))
    .pipe(rename({ extname: '.webp' }))
    .pipe(dest('src/assets/img'))
    .on('end', done);
};

// === BUILD: WEBP В APP (оптимизация) ===
const convertToWebp = (done) => {
  if (isDevelopment) return done();

  return src('src/assets/img/**/*.{png,jpg,jpeg}')
    .pipe(newer({ dest: 'app/img', ext: '.webp' }))
    .pipe(imagemin([webpConvert({ quality: 95 })]))
    .pipe(rename({ extname: '.webp' }))
    .pipe(dest('app/img'))
    .on('end', done);
};


const serve = () => {
  browserSync.init({
    server: {
      baseDir: "./app"
    },
  })

  watch(['src/styles/**/*.sass', 'src/components/**/*.sass'], styles)
  watch('src/assets/js/**/*.js', scripts)
  watch('src/components/**/*.pug', html)
  watch('src/resources/**', resources)
  
  // Добавление .webp/.png → создаём .webp + копируем всё
  watch('src/assets/img/**/*.{jpg,jpeg,png}', series(createWebpInSrc, images))
  
  // Если .webp добавлен вручную
  watch('src/assets/img/**/*.webp', images)
  
  watch('src/assets/_sprite/**/*.svg', svgSprites)
  watch('src/assets/img/sprite/*.svg', svgSpritesAssets)

  browserSync.watch('app/**/*.*').on('change', browserSync.reload)
}

const cache = () => {
  const manifest = readFileSync('src/manifest/rev.json')
  src('app/**/*.{css,js}', {base: 'app'})
    .pipe(rev())
    .pipe(revDel())
		.pipe(dest('app'))
    .pipe(rev.manifest('rev.json'))
    .pipe(dest('src/manifest'))
  return src('app/**/*.html')
      .pipe(revRewrite({
        manifest
      }))
      .pipe(dest('app'))
};


// === ИСПРАВЛЕНО: ЭКСПОРТЫ ===
exports.dev = series(
  clean, 
  parallel(html, fontsAssets, scripts, styles, resources, svgSprites, images), 
  svgSpritesAssets, 
  createWebpInSrc, 
  serve
)

exports.build = series(
  clean, 
  parallel(html, fontsAssets, scripts, styles, resources, svgSprites), 
  images, 
  convertToWebp, 
  cache,
  serve
)