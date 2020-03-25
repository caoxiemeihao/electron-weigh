# electron-weigh
electron 实现的电子称读取
- 支持`ajax`和`websocket`获取信息
- 打包好的程序 [电子称-win32-x64](https://github.com/caoxiemeihao/electron-weigh/tree/master/dist)

### 开发
```bash
npm run dev # 开发时候可以热更新
```

### 编译
```bash
npm run rebuild # serialport 是 C/C++ 模块，所以需要编译。编译后会生成 .node 文件
```

### 打包
```bash
npm run package
```

**展示图**

![Image text](https://github.com/caoxiemeihao/electron-weigh/blob/master/show-img/show-img.png?raw=true)
<hr>
![Image text](https://raw.githubusercontent.com/caoxiemeihao/electron-weigh/master/show-img/show-img1.jpg)

---
> **参考链接** `fork源` [electron-serialport](https://github.com/nodebots/electron-serialport).
[electron-serialport-补充](https://github.com/helloyan/electron-serialport).
---
## electron-serialport

`一个能运行的electron-serialport例程`

## 依赖

```bash
# 安装node-gyp，建议全局
npm install -g node-gyp
## 很多无法编译的是缺少这个，时间不短，耐心等待，另外如果机器已有py27，可以设置进path，安装时会自动跳过
npm install -g windows-build-tools
```

## 使用

```bash
# clone源
git clone https://github.com/helloyan/electron-serialport.git
cd electron-serialport
# msvs_version参数视windows-build-tools安装的版本而定，默认是2017
npm install --msvs_version=2017
# 运行
npm start
```
