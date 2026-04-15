const p = require('path');
const cp = require('child_process');
const exe = p.join(p.dirname(require.resolve('node-notifier')), 'vendor', 'snoreToast', 'snoretoast-x64.exe');
console.log(cp.execSync('"' + exe + '" -t "CCNudge" -m "Test Click" -pid ' + process.ppid).toString());
