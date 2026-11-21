
module.exports = async (sock, msg) => {
  const jid = msg.key.remoteJid;

  const menu = `
╔══════════════════════╗
       🔴 KESHAN MINI BOT
╚══════════════════════╝

       ☠️ COMMAND CENTER ☠️

👑 GENERAL COMMANDS

.ping
.menu
.status
.jid
.pair

🎵 MUSIC COMMANDS

.song [name]
.csong [YouTube URL]
.autosong
.stopcsong

🛡️ SECURITY COMMANDS

.antidelete on
.antidelete off

━━━━━━━━━━━━━━━━━━━━━━

🎧 AUTO SONG : READY
🔴 THEME : DARK RED
👑 DEVELOPER : KESHAN

━━━━━━━━━━━━━━━━━━━━━━
       KESHAN MINI BOT
`;

  await sock.sendMessage(jid, {
    text: menu
  });
};
