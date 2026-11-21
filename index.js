
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const config = require("./config");

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    browser: [config.BOT_NAME, "Chrome", "1.0.0"],
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("KESHAN MINI BOT CONNECTED!");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log("Reconnecting...");
        setTimeout(startBot, 5000);
      } else {
        console.log("Session logged out. Pair again.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];

    if (!msg.message || msg.key.fromMe) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text || "";

    if (!text.startsWith(config.PREFIX)) return;

    const command = text
      .slice(config.PREFIX.length)
      .trim()
      .split(" ")[0]
      .toLowerCase();

    if (command === "ping") {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "🏓 KESHAN MINI BOT ONLINE!"
      });
    }

    if (command === "menu") {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🔴 KESHAN MINI BOT

.menu
.ping
.pair
.jid
.song
.csong
.autosong
.stopcsong
.antidelete
.status`
      });
    }

    if (command === "jid") {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `JID: ${msg.key.remoteJid}`
      });
    }
  });
}

startBot().catch(console.error);
