
module.exports = async (sock, msg, args) => {
  const jid = msg.key.remoteJid;

  const channel = args[0];

  if (!channel) {
    return sock.sendMessage(jid, {
      text: `🔴 KESHAN MINI BOT

🎵 AUTO SONG SETUP

Usage:
.autosong CHANNEL_ID

Auto check interval:
30 Minutes

Use .stopcsong to stop.`
    });
  }

  await sock.sendMessage(jid, {
    text: `🎵 AUTO SONG SETUP

Channel:
${channel}

Status: SETUP RECEIVED

Next step: Connect YouTube monitoring.`
  });
};
