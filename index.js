
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const config = require("./config");
const readline = require("readline");

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = q => new Promise(resolve => rl.question(q, resolve));

let starting = false;

async function startBot() {
  if (starting) return;
  starting = true;

  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    browser: [config.BOT_NAME, "Chrome", "1.0.0"],
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  if (!state.creds.registered) {
    console.log(`
🔴 KESHAN MINI BOT

[1] QR CODE LOGIN
[2] PAIR CODE LOGIN
`);

    const choice = await ask("Select login method: ");

    if (choice.trim() === "2") {
      const number = (await ask(
        "Enter WhatsApp number with country code: "
      )).replace(/\D/g, "");

      if (!/^\d{8,15}$/.test(number)) {
        console.log("Invalid number.");
        process.exit(1);
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const code = await sock.requestPairingCode(number);
        console.log("\n🔴 YOUR PAIRING CODE:", code);
        console.log("Enter it in WhatsApp Linked Devices.");
      } catch (err) {
        console.error("Pairing failed:", err.message);
      }
    } else if (choice.trim() === "1") {
      console.log("Waiting for QR code...");
    } else {
      console.log("Invalid selection.");
      process.exit(1);
    }
  }

  sock.ev.on("connection.update", async update => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      const qrcode = require("qrcode-terminal");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("🔴 KESHAN MINI BOT CONNECTED!");
      starting = false;
    }

    if (connection === "close") {
      const code =
        lastDisconnect?.error?.output?.statusCode;

      starting = false;

      if (code !== DisconnectReason.loggedOut) {
        console.log("Reconnecting in 5 seconds...");
        setTimeout(() => startBot().catch(console.error), 5000);
      } else {
        console.log("Logged out. Restart and pair again.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text || "";

      if (!body.startsWith(config.PREFIX)) continue;

      const args = body.slice(config.PREFIX.length)
        .trim().split(/\s+/);

      const command = args.shift()?.toLowerCase();

      try {
        if (commands[command]) {
          await commands[command](sock, msg, args);
        }
      } catch (error) {
        console.error(error);
        await sock.sendMessage(msg.key.remoteJid, {
          text: "❌ Command Error."
        });
      }
    }
  });
}

startBot().catch(console.error);
