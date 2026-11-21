
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

function ask(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    browser: [config.BOT_NAME, "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  if (!state.creds.registered) {
    const number = (await ask(
      "Enter WhatsApp number with country code: "
    )).replace(/\D/g, "");

    if (!/^\d{8,15}$/.test(number)) {
      console.log("Invalid phone number.");
      rl.close();
      return;
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log("Requesting Pairing Code...");

        const code =
          await sock.requestPairingCode(number);

        console.log("\n================================");
        console.log("KESHAN MINI BOT PAIRING CODE");
        console.log("CODE:", code);
        console.log("================================\n");

        console.log(
          "Enter this code in WhatsApp Linked Devices."
        );

        break;
      } catch (error) {
        console.log("Pairing attempt failed:", error.message);

        if (attempt < 3) {
          console.log("Wait 60 seconds before retrying.");
          await new Promise(resolve =>
            setTimeout(resolve, 60000)
          );
        } else {
          console.log("Pairing failed. Restart Termux later.");
        }
      }
    }

    rl.close();
  }

  sock.ev.on("connection.update", async update => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("KESHAN MINI BOT CONNECTED!");
    }

    if (connection === "close") {
      const code =
        lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log("Reconnecting in 5 seconds...");

        setTimeout(() => {
          startBot().catch(console.error);
        }, 5000);
      } else {
        console.log(
          "Logged out. Restart and pair again."
        );
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

      const command = args.shift()?.toLowerCase();

      try {
        if (commands[command]) {
          await commands[command](sock, msg, args);
        }
      } catch (error) {
        console.error(error);

        await sock.sendMessage(msg.key.remoteJid, {
          text: "Command Error. Please try again."
        });
      }
    }
  });
}

startBot().catch(console.error);
