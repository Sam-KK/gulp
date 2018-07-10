/*
* @Author: YSH7765
* @Date:   2018-07-09 14:36:10
* @Last Modified by:   YSH7765
* @Last Modified time: 2018-07-10 11:22:41
*/

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

let merge = require('lodash.merge'),
    spritesmith = require('gulp.spritesmith'),
    runSequence = require('run-sequence');
let packages = merge(require('./package.json'));


const plugins = gulpLoadPlugins({
	config: packages,
	camelize: true
});
const reload = browserSync.reload;

let autoprefixerOptions = {
        browsers: ['IE 9', 'last 5 versions', 'Firefox 14', 'Firefox ESR', 'Opera 11.1', '> 1%']
    },
    paths = {
        dist: {
            src: 'dist'
        },
        html: {
            src: 'src',
            dest: 'dist'
        },
        components: {
            src: 'src/components'
        },
        styles: {
            src: 'src/less',
            dest: 'dist/css'
        },
        scripts: {
            src: 'src/js',
            dest: 'dist/js'
        },
        images: {
            src: 'src/images',
            dest: 'dist/images'
        },
        sprites: {
            src: 'src/sprite',
            template: 'src/sprite/template'
        },
        fonts: {
            src: 'src/fonts',
            dest: 'dist/fonts'
        },
        libs: {
            src: 'src/libs',
            dest: 'dist/libs'
        }
    };

// 删除 dist 下所有文件
gulp.task('clean', function () {
    return gulp.src([paths.dist.src])
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError('cleanDist 任务执行失败! Error: <%= error.message %>')
        }))
        .pipe(plugins.clean())
        .pipe(plugins.notify('cleanDist 任务执行成功!clean文件: <%= file.relative %>'));
});

// 生成图片精灵
gulp.task('icon', () => {
    return gulp.src('./src/sprite/icon/*.png')
        .pipe(spritesmith({
            algorithm: 'binary-tree',
            cssFormat: 'less',
            cssTemplate: "./src/sprite/template/sprites.less.template",
            padding: 5,
            retinaSrcFilter: ['./src/sprite/icon/*@2x.png'],
            imgName: 'icon.png',
            retinaImgName: 'icon@2x.png',
            cssName: 'sprites.less'
        }))
        // ;

    // const imgStream = spriteData.img
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        }))
        .pipe(gulp.dest('./src/images/'))
        .pipe(plugins.notify(" icon-img 任务执行成功!生成文件: <%= file.relative %> "))
        // ;

    // const cssStream = spriteData.css
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        }))
        // .pipe(gulp.dest('./src/sprite/styles/'))
        .pipe(plugins.notify(" icon-css 任务执行成功!生成文件: <%= file.relative %> "));

    // return merge(imgStream, cssStream);
});

// 编译less
gulp.task('less', () => {
    return gulp.src(paths.styles.src + '/*.less')
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(' Less 编译失败! Error: <%= error.message %>')
        }))
        .pipe(plugins.lessChanged())
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer(autoprefixerOptions))
        .pipe(plugins.cleanCss())
        .pipe(plugins.rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(reload({stream: true}));
});

// 编译html
gulp.task('html', () => {
    return gulp.src(paths.html.src + `/*.html`)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        }))
        .pipe(plugins.newer(paths.html.dest))
        .pipe(plugins.ejs())
        .pipe(plugins.jsbeautifier())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(reload({stream: true}));
});


// 编译 include 文件
gulp.task('includesHtml', () => {
    return gulp.src(paths.html.src + `/*.html`)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError("Error: <%= error.message %>")
        }))
        .pipe(plugins.ejs())
        .pipe(plugins.jsbeautifier())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(reload({stream: true}));
});


// ES6
gulp.task('Script', () => {
    return gulp.src(paths.scripts.src + `/*.js`)
        .pipe(plugins.plumber())
        .pipe(plugins.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(paths.scripts.dest));
});


// 压缩图片
gulp.task('copyImg', () => {
    return gulp.src(paths.images.src + `/**/*`)
        .pipe(plugins.cache(plugins.imagemin({
                optimizationLevel: 3,
                progressive: true,
                interlaced: true
            })
        ))
        .pipe(plugins.newer(paths.images.dest))
        .pipe(gulp.dest(paths.images.dest));
});


//  COPY Libs任务
gulp.task('copyLibs', () => {
    return gulp.src(paths.libs.src + `/**/*`)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(' Error: <%= error.message %> ')
        }))
        .pipe(plugins.newer(paths.libs.dest))
        .pipe(gulp.dest(paths.libs.dest));
});

// COPY fonts 任务
gulp.task('copyFonts', () => {
    return gulp.src(paths.fonts.src + `/**/*`)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(' Error: <%= error.message %> ')
        }))
        .pipe(gulp.dest(paths.fonts.dest));
});


// 启动热更新
gulp.task('serve', () => {
    browserSync.init({
        server: {baseDir: ['./dist', './src', './']},
        ghostMode: {clicks: false, forms: false, scroll: false},
        open: false,
        notify: false
    });

// 监控文件变化，自动更新
    gulp.watch([paths.sprites.src + '/icon/*.png', '!' + paths.sprites.src + '!/icon/*副本.png'], ['icon']);
    gulp.watch([paths.sprites.src + '/styles/sprites.less'], ['copyImg', 'less']).on("change", function () {
        console.log(" icon图标编译成功! ");
    });
    gulp.watch([paths.html.src + `/*.html`, '!' + paths.html.src + `/**/*副本.html`], ['html']);
    gulp.watch([paths.components.src + `/**/*.html`, '!' + paths.components.src + `/**/*副本.html`], ['includesHtml']);
    gulp.watch([paths.styles.src + `/**/*.less`, '!' + paths.styles.src + `/**/*副本.less`], ['less']);
    gulp.watch([paths.scripts.src + `/**/*.js`, '!' + paths.scripts.src + `/**/*副本.js`], ['Script']);
    gulp.watch([paths.fonts.src + `/**/*`,], ['copyFonts']);
    gulp.watch([paths.images.src + `/**/*`, `!` + paths.images.src + `/**/*副本.*`], ['copyImg']);
});
gulp.task('default', () => {
    runSequence('clean', ['icon', 'html', 'less', 'Script', 'copyFonts', 'copyImg', 'copyLibs',], 'serve', function () {
        console.log('项目编译成功！');
    })
});

