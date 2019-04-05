const SerialPort = require('serialport');
const events = require('events');
const config = require('../config/config');

let emiter = new events.EventEmitter();
let serialPort = null;

if(serialPort != null){
	serialPort.close();
}

serialPort = new SerialPort( //设置串口属性
	config.COM_PORT,
	{
	   baudRate: 9600,  //波特率
	   dataBits: 8,    //数据位
	   parity: 'none',   //奇偶校验
	   stopBits: 1,   //停止位
	   flowControl: false ,
	   autoOpen:false //不自动打开
	}, false);

serialPort.open(function(error){
   if(error){
     console.log("打开端口"+config.COM_PORT+"错误："+error);
   }else{ 
   	console.log("打开端口成功，正在监听数据中");
     serialPort.on('data',function(data){
		let d = data.toString();
		emiter.emit('weight', { val: d });
     	console.log(d);
     })
   }
});

SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});
