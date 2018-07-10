/*
* @Author: YSH7765
* @Date:   2018-07-09 14:36:10
* @Last Modified by:   YSH7765
* @Last Modified time: 2018-07-10 11:22:41
*/

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins'; // 自动加载插件 省去一个一个require进来
import browserSync from 'browser-sync';          //浏览器同步
let merge    = require('lodash.merge');
let packages = merge(
  	require('./package.json')
);
const plugins = gulpLoadPlugins({
	config: packages,
	camelize: true
});
const reload = browserSync.reload;

let paths = {
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
	return gulp.src([
		'./dist',
		'!package.json',
	]).pipe(plugins.clean());
});

// 生成图片精灵
// gulp.task('icon', () => {
//     var spriteData = gulp.src('./src/sprite/icon/*.png')
//         .pipe(plugins.spritesmith({
//             algorithm: 'binary-tree',
//             cssFormat: 'less',
//             cssTemplate: "./src/sprite/template/sprites.less.template",                                            //保存合并后对于css样式的地址
//             padding: 5,          //注释2
//             retinaSrcFilter: ['./src/sprite/icon/*@2x.png'],
//             imgName: 'icon.png',
//             retinaImgName: 'icon@2x.png',
//             cssName: 'sprites.less'
//         }));
//     var imgStream = spriteData.img
//         .pipe(plugins.plumber({
//             errorHandler: plugins.notify.onError('Error: <%= error.message %>')
//         }))
//         .pipe(gulp.dest('./src/images/'))
//         .pipe(plugins.notify(" icon-img 任务执行成功!生成文件: <%= file.relative %> "));

//     var cssStream = spriteData.css
//         .pipe(plugins.plumber({
//             errorHandler: plugins.notify.onError('Error: <%= error.message %>')
//         }))
//         .pipe(gulp.dest('./src/sprite/styles/'))
//         .pipe(plugins.notify(" icon-css 任务执行成功!生成文件: <%= file.relative %> "));

//     return merge(imgStream, cssStream);
// });


// 编译less
gulp.task('less', () => {
	return gulp.src(`${paths.styles.src}/**/*.less`) // 指明源文件路径 读取其数据流
	.pipe(plugins.plumber({
        errorHandler: plugins.notify.onError(' Less 编译失败! Error: <%= error.message %>')
    }))                                     // 替换错误的pipe方法  使数据流正常运行
	// .pipe(plugins.sourcemaps.init())                // 压缩环境出现错误能找到未压缩的错误来源
	.pipe(plugins.less())
	.pipe(plugins.autoprefixer({
        browsers: ['IE 9', 'last 5 versions', 'Firefox 14', 'Firefox ESR', 'Opera 11.1', '> 1%']
    }))
	.pipe(plugins.cleanCss())                       // 压缩新生成的css
    .pipe(plugins.rename({
        suffix:'.min'
    }))
	// .pipe(plugins.sourcemaps.write('.'))            // map文件命名
	.pipe(gulp.dest(paths.styles.dest))          // 指定输出路径
	.pipe(reload({
        stream: true
    }));
});

// 编译html
gulp.task('html', () => {
    return gulp.src(`${paths.html.src}/*.html`)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        }))
        .pipe(plugins.newer(paths.html.dest))
        .pipe(plugins.ejs())
        .pipe(plugins.jsbeautifier())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(reload({
        	stream:true
        }));
});


// 编译 include 文件
gulp.task('includesHtml', () => {
    return gulp.src(`${paths.html.src}/*.html`)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError("Error: <%= error.message %>")
        }))
        .pipe(plugins.ejs())
        .pipe(plugins.jsbeautifier())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(reload({
            stream: true
        }));
});


// ES6
gulp.task('Script', () => {
	return gulp.src(`${paths.scripts.src}/**/*.js`)
	.pipe(plugins.plumber())
	// .pipe(plugins.sourcemaps.init())
	.pipe(plugins.babel({
		presets: ['es2015']
	}))    //靠这个插件编译;
	// .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(reload({
        stream: true
    }));
});


// 压缩图片
gulp.task('copyImg', () => {
	return gulp.src(`${paths.images.src}/**/*`)
	.pipe(plugins.cache(plugins.imagemin ({           //使用cache只压缩改变的图片
      	optimizationLevel: 3,         //压缩级别
      	progressive: true,
      	interlaced: true})
    )).pipe (gulp.dest (paths.images.dest));
});


//  COPY Libs任务
gulp.task('copyLibs', () => {
    return gulp.src(`${paths.libs.src}/**/*`)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(' Error: <%= error.message %> ')
        }))
        .pipe(plugins.newer(paths.libs.dest))
        .pipe(gulp.dest(paths.libs.dest));
});

// COPY fonts 任务
gulp.task('copyFonts', () => {
    return gulp.src(`${paths.fonts.src}/**/*`)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(' Error: <%= error.message %> ')
        }))
        .pipe(gulp.dest(paths.fonts.dest));
});


// 启动热更新
gulp.task('serve', ['clean'], () => {
	gulp.start([
        // 'icon',
        'html',
        'less',
        'Script',
        'copyFonts',
        'copyImg',
        'copyLibs',
    ], function () {
        console.log("编译成功!")
    });
	browserSync.init({
        server: {
            baseDir: [
                './dist',
                './src',
                './'
            ]
        },
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        },
        open: false,
        notify: false
    });

    // 监控文件变化，自动更新
    // gulp.watch(['src/sprite/icon/*.png', '!src/sprites/icon/*副本.png'], ['icon']);
    // gulp.watch('src/sprite/styles/sprites.less', ['copyImg', 'less']).on("change", function () {
    //     console.log(" icon图标编译成功! ");
    // });

    gulp.watch([
	    	`${paths.html.src}/*.html`,
	    	`${paths.components.src}/**/*.html`,
	    	`!${paths.html.src}/**/*副本.html`
    	],
		['html']);
    gulp.watch([
	    	`${paths.components.src}/**/*.html`,
	    	`!${paths.components.src}/**/*副本.html`
	    ],
    	['includesHtml']);

    gulp.watch([
    		`${paths.styles.src}/**/*.less`,
    		`!${paths.styles.src}/**/*副本.less`
    	],
    	['less']);

    gulp.watch([
    		`${paths.scripts.src}/**/*.js`,
    		`!${paths.scripts.src}/**/*副本.js`
	    ],
    	['Script']);
    gulp.watch([
    		`${paths.fonts.src}/**/*`,
    	],
    	['copyFonts']);
    gulp.watch([
    		`${paths.images.src}/**/*`,
    		`!${paths.images.src}/**/*副本.*`
    	],
    	['copyImg']);
});

gulp.task('default', ['serve']);
