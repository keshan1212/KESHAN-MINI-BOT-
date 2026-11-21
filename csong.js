
module.exports = async (sock, msg, args) => {
  const jid = msg.key.remoteJid;

  const audioUrl = args[0];

  if (!audioUrl) {
    return sock.sendMessage(jid, {
      text: `🔴 KESHAN MINI BOT

🎵 CSONG COMMAND

Usage:
.csong AUDIO_URL

Send an audio link that you own
or have permission to share.

Voice Note mode: PTT`
    });
  }

  if (!/^https?:\/\//i.test(audioUrl)) {
    return sock.sendMessage(jid, {
      text: "❌ Please provide a valid audio URL."
    });
  }

  await sock.sendMessage(jid, {
    text: "🎵 Audio URL received. Voice Note delivery will be connected in the next setup step."
  });
};
