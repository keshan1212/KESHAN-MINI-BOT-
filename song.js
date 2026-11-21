
module.exports = async (sock, msg, args) => {
  const jid = msg.key.remoteJid;
  const songName = args.join(" ");

  if (!songName) {
    return sock.sendMessage(jid, {
      text: "🎵 Usage: .song Song Name"
    });
  }

  const query = encodeURIComponent(songName);

  await sock.sendMessage(jid, {
    text:
      `🎵 KESHAN MINI BOT\n\n` +
      `🔎 Song: ${songName}\n\n` +
      `▶️ YouTube Search:\n` +
      `https://www.youtube.com/results?search_query=${query}`
  });
};
