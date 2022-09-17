import { readFileSync, watchFile } from "fs";
import path from 'path'
import { writeFile, appendFile } from "fs/promises";
import notifier from "node-notifier";
const configPathArray = [
  {
    proxy: '/Users/liusongbai/Library/Mobile\ Documents/iCloud\~com\~nssurge\~inc/Documents/subscribe_zi.conf',
    local: '/Users/liusongbai/Library/Mobile\ Documents/iCloud\~com\~nssurge\~inc/Documents/Copy\ 自由飞.conf',
    name: '自由飞'
  },
  {
    proxy: '/Users/liusongbai/Library/Mobile\ Documents/iCloud\~com\~nssurge\~inc/Documents/subscribebai.conf',
    local: '/Users/liusongbai/Library/Mobile\ Documents/iCloud\~com\~nssurge\~inc/Documents/Copy\ 白月光.conf',
    name: '白月光'
  }
]

function updateFile(proxyPath, localPath) {
  let data = readFileSync(proxyPath).toString();
  const copyText = data.match(
    /.*\[Proxy\sGroup\]\sProxy\s=\sselect,\sauto,\sfallback,\s(.*\s)/
  )[1];
  let targetData = readFileSync(localPath).toString();
  let newstr = targetData.replace(
    /.*(\[Proxy\sGroup\]\sProxy\s=\sselect,\s)(.*)\s/,
    function (match, p1, p2) {
      return p1 + copyText;
    }
  );

  writeFile(localPath, newstr)
    .then((res) => {
      notifier.notify(
        {
          title: "脚本通知",
          message: "surge订阅文件同步成功",
          // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
          sound: true, // Only Notification Center or Windows Toasters
          wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
          timeout: 10,
        },
        function (err, response, metadata) {
          // Response is response from notification
          // Metadata contains activationType, activationAt, deliveredAt
        }
      );
    })
    .catch((err) => {
      notifier.notify(
        {
          title: "脚本通知",
          message: "surge订阅文件同步失败",
          // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
          sound: true, // Only Notification Center or Windows Toasters
          wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
          timeout: 10,
        },
        function (err, response, metadata) {
          // Response is response from notification
          // Metadata contains activationType, activationAt, deliveredAt
        }
      );
    });
}

configPathArray.forEach((item) => {
  updateFile(item.proxy, item.local)
  watchFile(item.proxy, function(curr, prev) {
    const str = `${curr.mtime}: 【${item.name}】订阅同步\n`
    console.log(str);
    appendFile(`${path.resolve()}/log.log`,str)
    updateFile(item.proxy, item.local)
  })
})
