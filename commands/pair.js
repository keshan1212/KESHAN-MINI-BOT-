
module.exports = async (sock, msg) => {
  const jid = msg.key.remoteJid;

  const text = `
🔴 KESHAN MINI BOT

☠️ PAIRING SYSTEM

Pairing Code ලබාගැනීමට:

1. Termux Open කරන්න.
2. Bot එක Start කරන්න.
3. [2] PAIR CODE LOGIN තෝරන්න.
4. WhatsApp Number එක ඇතුළත් කරන්න.

📱 QR Login සඳහා [1] තෝරන්න.

⚠️ Pairing Code එක රහසක් ලෙස තබාගන්න.

© KESHAN MINI BOT
`;

  await sock.sendMessage(jid, { text });
};
