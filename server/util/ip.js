/**
 * 获取服务器的绝对ip地址，开发环境下带有端口后4000， 生产环境下默认80端口
 */
const os = require('os');
const serverIp = getIPAdress()
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
          var alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              return alias.address;
          }
      }
  }
}

module.exports = process.env.NODE_ENV === 'production' ? `http://${serverIp}` : `http://${serverIp}:4000`