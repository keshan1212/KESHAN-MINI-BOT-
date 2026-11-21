
module.exports = async (sock, msg) => {
  const jid = msg.key.remoteJid;
  const start = Date.now();

  await sock.sendMessage(jid, {
    text: "🔴 KESHAN MINI BOT\n\n🏓 PONG!\n⚡ Status: ONLINE\n👑 Bot: KESHAN MINI BOT"
  });
};
