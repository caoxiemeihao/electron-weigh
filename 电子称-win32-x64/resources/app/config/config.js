module.exports = {
    window: {
        width: 800,         // 窗口宽度
        height: 600,        // 窗口高度
        // x: 0,               //
        // y: 0,               //
    },
    convert: {
        kg2lb: kg => kg * 2.2046226218488, // 千克 -> 磅
        lb2kg: lb => lb * 0.45359237,      //   磅 -> 千克
        kg2g : kg => kg * 1000,            // 千克 -> 克
        g2kg : g  => g / 1000,             //   克 -> 千克
    },
    keepLength: 4,                         // 保留小数点长度
    isOpenTools: false,                    // 默认开启 console
    http: {
        port: 3000,                        // 服务监听地址
        middleware: (req, res) => {        // http中间件
            res.setHeader('Access-Control-Allow-Origin', '*')  // 开放跨域
        },
    }
};

/**
 * 1磅=0.45359237千克
 * 1千克=2.2046226218488磅
 *
 */
/*
[
  {
    "comName": "COM6",
    "manufacturer": "Microsoft",
    "pnpId": "BTHENUM\\{00001101-0000-1000-8000-00805F9B34FB}_LOCALMFG&0002\\7&82A793C&0&DC1D3040E261_C00000000"
  },
  {
    "comName": "COM8",
    "manufacturer": "wch.cn",
    "serialNumber": "5&6d6f5b5&0&11",
    "pnpId": "USB\\VID_1A86&PID_7523\\5&6D6F5B5&0&11",
    "locationId": "Port_#0011.Hub_#0001",
    "vendorId": "1A86",
    "productId": "7523"
  }
]
*/
