const gulp = require('gulp')
const electron = require('electron-connect').server.create()

gulp.task('watch:electron', () => {
    electron.start()
    gulp.watch(['./*.js', './src/*.js'], electron.restart)
    gulp.watch(['./front/css/*.css', './front/js/*.js', '.*.html'], electron.reload)
})