
module.exports = async (sock, msg) => {
  const jid = msg.key.remoteJid;

  const menu = `
╔════════════════════╗
    🔴 KESHAN MINI BOT
╚════════════════════╝

👑 COMMAND MENU

.pair
.menu
.ping
.jid
.song
.csong
.autosong
.stopcsong
.antidelete
.status

━━━━━━━━━━━━━━━━━━━━
🎵 AUTO SONG : READY
🔴 BOT STATUS : ONLINE
━━━━━━━━━━━━━━━━━━━━

© KESHAN MINI BOT
`;

  await sock.sendMessage(jid, { text: menu });
};
