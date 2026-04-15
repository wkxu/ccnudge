const os = require('os');
const path = require('path');
const cp = require('child_process');

function notify() {
  const cwd = path.basename(process.cwd());
  const platform = os.platform();

  if (platform === 'darwin') {
    cp.execSync(`osascript -e 'display notification "Finished in ${cwd}" with title "CCNudge" sound name ""'`);
  } else if (platform === 'linux') {
    cp.execSync(`notify-send "CCNudge" "Finished in ${cwd}"`);
  } else if (platform === 'win32') {
    try {
      const notifierPath = require.resolve('node-notifier');
      const arch = os.arch() === 'ia32' ? 'x86' : 'x64';
      const snore = path.join(path.dirname(notifierPath), 'vendor', 'snoreToast', `snoretoast-${arch}.exe`);
      
      const args = ['-t', 'CCNudge', '-m', `Finished in ${cwd}`, '-silent'];

      // Add AppID to bring terminal to front when clicked
      if (process.env.WT_SESSION) {
        args.push('-appID', 'Microsoft.WindowsTerminal_8wekyb3d8bbwe!App');
      } else if (process.env.TERM_PROGRAM === 'vscode') {
        args.push('-appID', 'Microsoft.VisualStudioCode');
      }

      // Detached spawn so it doesn't block Claude Code
      cp.spawn(snore, args, { detached: true, stdio: 'ignore' }).unref();
    } catch (e) {
      // Fallback
      cp.execSync(`powershell -c "New-BurntToastNotification -Text 'CCNudge', 'Finished in ${cwd}'"`);
    }
  }
}

notify();
