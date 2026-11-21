
const config = require("../config");

async function pairCommand(sock, msg, args) {
  const jid = msg.key.remoteJid;

  if (!msg.key.fromMe) {
    return sock.sendMessage(jid, {
      text: "❌ Pair command එක Bot Owner විසින් පමණක් භාවිතා කළ හැකියි."
    });
  }

  await sock.sendMessage(jid, {
    text: "🔴 KESHAN MINI BOT\n\nPairing සඳහා Termux හි Bot එක ආරම්භ කර Phone Number එක ලබාදෙන්න."
  });
}

module.exports = pairCommand;
