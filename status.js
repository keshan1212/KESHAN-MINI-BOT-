
module.exports = async (sock, msg) => {
  const jid = msg.key.remoteJid;

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  const status = `
🔴 KESHAN MINI BOT

🤖 BOT STATUS: ONLINE

⏱️ UPTIME:
${hours} Hours ${minutes} Minutes

🎵 SONG SYSTEM: READY
📡 CONNECTION: ACTIVE
👑 BOT: KESHAN MINI BOT

© KESHAN MINI BOT
`;

  await sock.sendMessage(jid, {
    text: status
  });
};
