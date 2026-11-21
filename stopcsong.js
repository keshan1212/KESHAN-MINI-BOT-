
module.exports = async (sock, msg) => {
  const jid = msg.key.remoteJid;

  await sock.sendMessage(jid, {
    text: `🔴 KESHAN MINI BOT

⏹️ AUTO SONG STOP

Auto Song stop request received.

🎵 Status: STOP REQUESTED

© KESHAN MINI BOT`
  });
};
