
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const config = require("./config");

const commands = {
  menu: require("./commands/menu"),
  ping: require("./commands/ping"),
  pair: require("./commands/pair"),
  jid: require("./commands/jid"),
  song: require("./commands/song"),
  csong: require("./commands/csong"),
  autosong: require("./commands/autosong"),
  stopcsong: require("./commands/stopcsong"),
  antidelete: require("./commands/antidelete"),
  status: require("./commands/status")
};

let reconnecting = false;

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    browser: [config.BOT_NAME, "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      reconnecting = false;
      console.log("KESHAN MINI BOT CONNECTED!");
    }

    if (connection === "close" && !reconnecting) {
      const code =
        lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        reconnecting = true;
        console.log("Reconnecting...");
        setTimeout(() => {
          reconnecting = false;
          startBot().catch(console.error);
        }, 5000);
      } else {
        console.log("Session logged out. Pair again.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

      if (!body.startsWith(config.PREFIX)) continue;

      const args = body
        .slice(config.PREFIX.length)
        .trim()
        .split(/\s+/);

      const command = args.shift().toLowerCase();

      try {
        if (commands[command]) {
          await commands[command](sock, msg, args);
        }
      } catch (error) {
        console.error(error);
        await sock.sendMessage(msg.key.remoteJid, {
          text: "❌ Command Error. Please try again."
        });
      }
    }
  });
}

startBot().catch(console.error);
