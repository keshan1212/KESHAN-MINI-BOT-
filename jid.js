
module.exports = async (sock, msg) => {
  const jid = msg.key.remoteJid;

  const sender =
    msg.key.participant || msg.key.remoteJid;

  const message = `
🔴 KESHAN MINI BOT

📌 CHAT JID:
${jid}

👤 SENDER JID:
${sender}

━━━━━━━━━━━━━━━━
© KESHAN MINI BOT
`;

  await sock.sendMessage(jid, {
    text: message
  });
};
