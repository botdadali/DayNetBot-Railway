const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { state, saveState } = useSingleFileAuthState('./session/creds.json');
const fs = require('fs');
const path = require('path');

const botName = 'DayNetBot';
const katalogPath = './media/katalog.pdf';
const produkPath = './media/produk.jpg';

async function startSock() {
    const sock = makeWASocket({ auth: state });
    sock.ev.on('creds.update', saveState);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        const sender = msg.key.remoteJid;

        if (text.toLowerCase() === 'menu') {
            await sock.sendMessage(sender, { 
                text: `*${botName}*

Ketik:
1. katalog
2. produk
3. info`
            });
        } else if (text.toLowerCase() === 'katalog') {
            await sock.sendMessage(sender, {
                document: fs.readFileSync(katalogPath),
                fileName: 'katalog-daynet.pdf',
                mimetype: 'application/pdf'
            });
        } else if (text.toLowerCase() === 'produk') {
            await sock.sendMessage(sender, {
                image: fs.readFileSync(produkPath),
                caption: 'Contoh Produk DayNet'
            });
        } else if (text.toLowerCase() === 'info') {
            await sock.sendMessage(sender, {
                text: `DayNetBot adalah bot WA siap pakai.

Hubungi admin untuk informasi lebih lanjut.`
            });
        }
    });

    console.log(`✅ ${botName} is ready!`);
}

startSock();
