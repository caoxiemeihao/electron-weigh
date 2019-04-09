// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipc = require('electron').ipcRenderer // IPC 通讯
const SerialPort = require('serialport')
// const events = require('events')
const config = require('../config/config')
const os = require('os')
const http = require('http')
const socket = require('socket.io')


// let emiter = new events.EventEmitter()
let serialPort = null
let server = null
let io = null
let vm = new Vue({
    data: {
        toolsShow: false,
        ports: [],         // 串口列表
        log: '',
        weightArr: [['千克 kg', '0'], ['克 g', '0'], ['磅 lb', '0']], // 展示用
        weightJson: [],                                              // 给请求用
        address: '',
        connection: false, // socket.io 链接
        http: false,       // http 请求
    },
    methods: {
        refresh() {
            window.location.reload(true) // 刷新页面
            bootstrap()                  // 重新连接
        },
        toggleTools() {
            ipc.send('message', {
                cmd: 'toggleDevTools',
                val: this.toolsShow = !this.toolsShow
            })
        },
        console(str, e = 0) { // 0 没错，1 有错
          console.log(str)
          this.log += `${this.log ? '<br>' : ''}<span style="color:${e ? '#ff6f6c': '#333'}">${str}</span>`
        },
    },
    filters: {
      strlen: function (str) {
        try {
          let arr = str.toString().split('.')
          return `${arr[0]}.${arr[1].substr(0, config.keepLength)}`
        } catch {
          return str
        }
      }
    },
    mounted() {
      bootstrap()
    }
}).$mount('#app')


// 页面部分
// *****************************************************************************
// 服务部分


function bootstrap() {
    serialPort != null && serialPort.close()
    startScanPort()
}

// 列出所有端口
function startScanPort() {
    SerialPort.list(function (err, ports) {
        vm.ports = ports
        ports.forEach(function(port) {
            // console.log(port.comName)                       // COM6
            // console.log(port.pnpId)
            // console.log(port.manufacturer)                  // Microsoft | wch.cn[电子称]
            if (port.serialNumber) startListenPort(port.comName) // serialNumber 有通讯的端口，才会有这个值
        })
    })
}

// 启动端口监听
function startListenPort(COM_PORT) {
  serialPort = new SerialPort( //设置串口属性
    COM_PORT,
    {
      baudRate: 9600,   //波特率
      dataBits: 8,      //数据位
      parity: 'none',   //奇偶校验
      stopBits: 1,      //停止位
      flowControl: false,
      autoOpen: false    //不自动打开
    }, false)

  serialPort.open(function (error) {
    let log, res

    if (error) {
      log = `打开端口 ${COM_PORT} 错误：${error}`
      vm.console(log, 1)
    } else {
      log = "打开端口成功，正在监听数据中..."
      startServer()
      serialPort.on('data', function (data) {
        log = data.toString()
        console.log(log)
        io.emit('weight_data', log)
        res = unitConvert(log)
        vm.weightArr = res.arr
        vm.weightJson = res.json
      })
      vm.console(log)
    }
  })
}

// 单位转换
function unitConvert(unit) { // unit = [+ 0.6478 lb]
  let json = {}, res = unitSplit(unit)

  if (unit.indexOf(' lb') !== -1) {
    json.kg = config.convert.lb2kg(res.number)
    json.g  = config.convert.kg2g(json.kg)
    json.lb = res.number
  } else if (unit.indexOf(' kg') !== -1) {
    json.kg = res.number
    json.g  = config.convert.kg2g(json.kg)
    json.lb = config.convert.kg2lb(json.kg)
  } else if (unit.indexOf(' g') !== -1) {
    json.kg = config.convert.g2kg(res.number)
    json.g  = res.number
    json.lb = config.convert.kg2lb(json.kg)
  }

  return {
    json: [{ kg: json.kg }, { g: json.g }, { lb: json.lb }],
    arr: [['千克 kg', json.kg], ['克 g', json.g], ['磅 lb', json.lb]]
  }
}

// 格式化读取重量
function unitSplit(unit) {  // unit = [+ 0.6478 lb]
  let arr = unit.split(/\s+/)

  return { symbol: arr[0], number: +arr[1], unit: arr[2], }
}

function startServer() {
    // $.get('http://192.168.116.1:3000').then(res => console.log(res))
  server = http.createServer((req, res) => {
    let str = ''

    config.http.middleware(req, res)
    try {
      str = JSON.stringify(vm.weightJson)
    } catch (e) { vm.console.log(e, 1) }
    vm.http = true                              // 点亮http指示
    res.write(str)
    res.end()
    setTimeout(() => vm.http = false, 900)
  })
  io = socket(server)
  io.on('connection', client => {
    vm.connection = true
    client.on('disconnect', () => vm.connection = false)
  })
  server.listen(config.http.port, () => {
    vm.console(`http 服务器启动成功`)
    vm.address = `${getIPAdress()}:${config.http.port}`
  })
}

///////////////////获取本机ip///////////////////////
function getIPAdress() {
    let interfaces = os.networkInterfaces()
    for (let devName in interfaces) {
        let iface = interfaces[devName]
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address
            }
        }
    }
}
///////////////////获取本机ip///////////////////////
