// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
// const client = require('electron-connect').client // 热加载监听
const ipc = require('electron').ipcMain           // 进程通讯
const config = require('./config/config')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let CMD = {
    toggleDevTools: toggleDevTools
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: config.window.width,
    height: config.window.height,
    webPreferences: {
      nodeIntegration: true
    },
    ...config.window,
    ...config.env_dev ? config.window_dev : {}
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  init()
}

// ------------------------------------------------
// 19-06-03 add
function init() {
  if (config.env_dev) {
    // 打开开发者工具
    toggleDevTools(true)

    // 监听文件更改
    require('electron-connect').client.create(mainWindow)
  }
}
// ------------------------------------------------

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 切换 DevTools
function toggleDevTools(bool) {
    if (mainWindow) {
        bool
          ? mainWindow.webContents.openDevTools()
          : mainWindow.webContents.closeDevTools()
    }
}

// IPC 通讯
ipc.on('message', function (event, json) {
  event.sender.send('reply', event, json)
  CMD[json.cmd](json.val)
})

// 模块导出
