const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
} = require('./lib/functions')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const {
  sms,
  downloadMediaMessage
} = require('./lib/msg')
const axios = require('axios')
const {
  File
} = require('megajs')
const {
  fromBuffer
} = require('file-type')
const bodyparser = require('body-parser')
const {
  tmpdir
} = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX
const ownerNumber = ['94787351423']

if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
  const sessdata = config.SESSION_ID
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
  filer.download((err, data) => {
    if (err) throw err
    fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
      console.log("SESSION DOWNLOADED COMPLETED ✅")
    })
  })
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

async function connectToWA() {
  console.log("CONNECTING DIZER MD 🎭...");
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/')
  var {
    version
  } = await fetchLatestBaileysVersion()

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version
  })

  conn.ev.on('connection.update', (update) => {
    const {
      connection,
      lastDisconnect
    } = update
    if (connection === 'close') {
      if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
        connectToWA()
      }
    } else if (connection === 'open') {
      console.log('♻️ INSTALLING PLUGINS FILES PLEASE WAIT... 🪄')
      const path = require('path');
      fs.readdirSync("./plugin/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
          require("./plugin/" + plugin);
        }
      });
      console.log('PLUGINS FILES INSTALL SUCCESSFULLY ✅')
      console.log('DIZER MD CONNECTED TO WHATSAPP ENJOY ✅')

      let up = `*
╭──────────────●●►*
> * Dɪᴢᴇʀ Mᴅ Cᴏɴɴᴇᴄᴛᴇᴅ Sᴜᴄᴄᴇssғᴜʟʟʏ Tʏᴘᴇ .Mᴇɴᴜ Tᴏ Gᴇᴛ Cᴏᴍᴍᴀɴᴅ Lɪsᴛ *
> * Wʜᴀᴛsᴀᴘᴘ Cʜᴀɴɴᴇʟ Fᴏʀ Uᴘᴅᴀᴛᴇs *
https://whatsapp.com/channel/0029VatU6wh9cDDhlsnnLh15
> * TikTok Cʜᴀɴɴᴇʟ *
tiktok.com/@sudhu_doni_x
*╭⊱✫ DIZER MD ✫⊱╮*
│✫➠ - 📂REPOSITORY NAME: DIZER MD
│✫➠ - 📃DESCRIPTION: SRI LANKA BEST BOT
│✫➠ - 🛡️OWNER: DIZER MD
│✫➠ - 🌐URL: https://github.com/mr-anuhas/ANGEL-MD-V1.git
*YOUR BOT ACTIVE NOW ENJOY♥️🪄*

*PREFIX: ${prefix}*
*╰──────────────●●►*`;
      conn.sendMessage(conn.user.id, {
        image: {
          url: "https://files.catbox.moe/ak5sns.jpg"
        },
        caption: up
      })
    }
  })

  conn.ev.on('creds.update', saveCreds)

  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0]
    if (!mek.message) return
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true") {
      await conn.readMessages([mek.key])
    }

    const m = sms(conn, mek)
    const type = getContentType(mek.message)
    const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type === 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption : (type === 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption : ''
    const isCmd = body.startsWith(prefix)
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const q = args.join(' ')
    const from = mek.key.remoteJid
    const isGroup = from.endsWith('@g.us')
    const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
    const senderNumber = sender.split('@')[0]
    const botNumber = conn.user.id.split(':')[0]
    const pushname = mek.pushName || 'Sin Nombre'
    const isMe = botNumber.includes(senderNumber)
    const isOwner = ownerNumber.includes(senderNumber) || isMe
    const botNumber2 = await jidNormalizedUser(conn.user.id);
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
    const groupName = isGroup ? groupMetadata.subject : ''
    const participants = isGroup ? await groupMetadata.participants : ''
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false
    const isReact = m.message.reactionMessage ? true : false
    const reply = (teks) => conn.sendMessage(from, { text: teks }, { quoted: mek })

    // Add full logic here as in your code, updating any branding from ANGEL to DIZER

    const events = require('./command')
    const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
    if (isCmd) {
      const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
      if (cmd) {
        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })
        try {
          cmd.function(conn, mek, m, {
            from,
            quoted,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            sender,
            senderNumber,
            botNumber2,
            botNumber,
            pushname,
            isMe,
            isOwner,
            groupMetadata,
            groupName,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply
          });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
        }
      }
    }
  })
}

app.get("/", (req, res) => {
  res.send("HEY, DIZER MD WILL BE STARTED ✅");
});
app.listen(port, () => console.log(`Dizer Server listening on port http://localhost:${port}`));
setTimeout(() => {
  connectToWA()
}, 4000);
