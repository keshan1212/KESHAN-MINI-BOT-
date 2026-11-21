
module.exports = async (sock, msg, args) => {
  const jid = msg.key.remoteJid;

  const action = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(action)) {
    return sock.sendMessage(jid, {
      text: `🔴 KESHAN MINI BOT

🛡️ ANTIDELETE

.antidelete on
.antidelete off`
    });
  }

  await sock.sendMessage(jid, {
    text: action === "on"
      ? "🛡️ AntiDelete ON requested!"
      : "🛡️ AntiDelete OFF requested!"
  });
};
