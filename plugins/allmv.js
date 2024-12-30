const { fetchJson } = require('../lib/functions');
const config = require('../config');
const { cmd, commands } = require('../command');

const apilink = 'https://www.dark-yasiya-api.site';

cmd({
    pattern: "moviedl",
    desc: "download movies",
    category: "movie",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

        const blockGrp = config.BLOCK_JID
if(blockGrp.includes(from)) return

const premUsers = ['94751629685', '94781029321'];
        
        // Check if the user is premium
        if (!premUsers.includes(senderNumber)) {
            return reply(
                "*_You don't have access to download movies. Please contact the owner to get access._*\n\n*Owner:* 94751629685"
            );
        }
        
        // Validate input
        if (!q || !q.startsWith("https://sinhalasub.lk/")) {
            return reply(
                "*_Please provide a valid sinhalasub.lk URL & quality._*\n\n*Example :-* .moviedl url & quality\n\n( Available quality inputs: FHD 1080p, HD 720p, SD 480p )"
            );
        }

        // Split the input into URL and quality
        const inputParts = q.split("& ");
        const movieUrl = inputParts[0];
        const qualityInput = inputParts[1];

        // Fetch movie data
        const mv = await fetchJson(`${apilink}/movie/sinhalasub/movie?url=${movieUrl}`);

        // Validate the provided quality
        const availableQualities = ['SD 480p', 'HD 720p', 'FHD 1080p'];
        if (!availableQualities.includes(qualityInput)) {
            return reply(
                "*Invalid quality input.*\n\n*Available quality inputs:* SD 480p, HD 720p, FHD 1080p"
            );
        }

        // Filter download links based on the quality
        const filteredLinks = mv.result.data.dl_links.filter(
            (link) => link.quality === qualityInput && link.link.includes("pixeldrain.com")
        );

        if (filteredLinks.length === 0) {
            return reply(`*Can't download your movie in this quality.*`);
        }

        // Generate download URL
        const downloadUrl = filteredLinks[0].link.replace('/u/', '/api/file/');

        // Prepare caption and send the document
        const caption = `${mv.result.data.title} ( ${qualityInput} )\n\n> ϙᴜᴇᴇɴ-ᴅ ᴍᴏᴠɪᴇ ʙᴏᴛ`;

        await conn.sendMessage(
            from,
            {
                document: { url: downloadUrl },
                mimetype: "video/mp4",
                fileName: mv.result.data.title + ".mp4",
                caption: caption
            },
            { quoted: mek }
        );
    } catch (e) {
        console.error(e);
        reply(`${e}`)
    }
});
