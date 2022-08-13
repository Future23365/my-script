import { readFileSync, watchFile } from "fs";
import { writeFile } from "fs/promises";
import notifier from "node-notifier";
const proxyConfigPath = '/Users/liusongbai/Library/Mobile\ Documents/iCloud\~com\~nssurge\~inc/Documents/subscribe_zi.conf'
const localConfigPath = '/Users/liusongbai/Library/Mobile\ Documents/iCloud\~com\~nssurge\~inc/Documents/Copy\ 自由飞.conf'

function updateFile() {
  let data = readFileSync(proxyConfigPath).toString();
  const copyText = data.match(
    /.*\[Proxy\sGroup\]\sProxy\s=\sselect,\sauto,\sfallback,\s(.*\s)/
  )[1];
  let targetData = readFileSync(localConfigPath).toString();
  let newstr = targetData.replace(
    /.*(\[Proxy\sGroup\]\sProxy\s=\sselect,\s)(.*)\s/,
    function (match, p1, p2) {
      return p1 + copyText;
    }
  );

  writeFile(localConfigPath, newstr)
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
updateFile()
watchFile(proxyConfigPath, function(curr, prev) {
  console.log(`订阅更新时间: ${curr.mtime}`);
  updateFile()
})