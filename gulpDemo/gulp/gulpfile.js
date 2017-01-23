
var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
	 // pngquant = require('imagemin-pngquant'),//深度压缩png
	 uglify = require('gulp-uglify'), // js压缩
	  changed = require('gulp-changed'), // 只操作有过修改的文件
	  rename = require('gulp-rename'), // 文件重命名
	  concat = require("gulp-concat"),// 文件合并
	  minifyCss = require('gulp-minify-css'), // CSS压缩
	  clean = require('gulp-clean'); // 清除文件
// 配置文件
 var config={
 	src:"svn_data/fx/trunk/offiia/qqbibi_v2.0",//项目地址
 	exportSrc:'src/',//获取项目输出的的路径
 	endSrc:"dist/" //任务完成的路径
 }
// 获取项目文件并输出
gulp.task("getsrc",['clean'],function(){
    return gulp.src("../"+config.src+"/**/*")
    .pipe(gulp.dest(config.exportSrc)); 
})
 //压缩图片
gulp.task('testImagemin',['getsrc'], function () {
	console.log('开始压缩图片')
    return gulp.src(config.exportSrc+'**/*.{png,jpg,gif,ico}')
    .pipe(changed(config.endSrc)) // 对比文件是否有过改动（此处填写的路径和输出路径保持一致）
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            // use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest(config.endSrc));
});

// 压缩JS
gulp.task('script' ,['getsrc'],function() {
	console.log('开始压缩js')
  return gulp.src(config.exportSrc+'**/*.js')
  	// .pipe(rename({ suffix: '.min' })) // 重命名 // 指明源文件路径、并进行文件匹配
    .pipe(uglify({ preserveComments:'some' })) // 使用uglify进行压缩，并保留部分注释
    .pipe(gulp.dest(config.endSrc)); // 输出路径
});

//文件合并
gulp.task('concat',['getsrc'], function () {
    gulp.src('js/**/*.min.js')  // 要合并的文件
    .pipe(concat('concat.js'))  // 合并成libs.js
    .pipe(gulp.dest(config.endSrc+'js')); // 输出路径
});
//压缩CSS
gulp.task('minifyCss', ['getsrc'],function() {
	console.log('开始压缩Css')
  return gulp.src(config.exportSrc+'**/*.css')
    // .pipe(rename({ suffix: '.min' })) // 重命名 // 指明源文件路径、并进行文件匹配
    .pipe(minifyCss({
                advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
                compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
                keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
                keepSpecialComments: '*'
                //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
            }))
    .pipe(gulp.dest(config.endSrc)); // 输出路径
});
// 输出html文件
gulp.task("html",['getsrc'],function(){
	console.log('开始输出html')

    gulp.src(config.exportSrc+"/**/*.html")
    .pipe(gulp.dest(config.endSrc)); // 输出路径
    // console.log(config.exportSrc+".html")
})
gulp.task("clean", function(){
    return gulp.src(config.exportSrc)
        .pipe(clean());
})
gulp.task("cleanDist", function(){
    return gulp.src(config.endSrc)
        .pipe(clean());
})

// 任务串联
gulp.task("bulid",['cleanDist','testImagemin','script','minifyCss','html'],function(){
	console.log('执行完毕')

});

// 交换项目
gulp.task("changed",['bulid'],function(){
    gulp.src(config.endSrc+'**/*')

    .pipe(gulp.dest("../"+config.src)); // 把处理好文件放回原来路径

})
// 备份上次项目
gulp.task("backups",function(){
    gulp.src("../"+config.src+"/**/*")
    .pipe(gulp.dest("backups")); // 把处理好文件放到备份路径
})

