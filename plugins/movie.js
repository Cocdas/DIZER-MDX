const {cmd , commands} = require('../command')
cmd({
    pattern: "moviedl1",
    react: "📥",
    description: "movie downloader",
    use: ".movie kgf",
    filename: __filename
}, async (conn, mek, m, { from, q, isDev, reply }) => {
    if (!q) { return await reply('*Please provide a direct URL!*')}
    try {

const data0 = await fetchJson(`https://vajiraapi-089fa316ec80.herokuapp.com/movie/sinhalasub/search?text=${q}`);   

const data1 = data0.result.data[0].link
console.log(data1)

const data = await fetchJson(`https://vajiraapi-089fa316ec80.herokuapp.com/movie/sinhalasub/movie?url=${data1}`);   	    
const data2 = data.result.data.pixeldrain_dl[2].link
console.log(data2)
    
const cap = `        
Title : ${data.result.data.title}
Date : ${data.result.data.date}
Country : ${data.result.data.country}
> *💗𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - : Qᴜᴇᴇɴ ᴛʜᴀʀᴜ 🧚‍*
`	    
await conn.sendMessage(from, { image: { url: data.result.data.image}, caption: cap } , { quoted: mek })


	    
        const message = {
            document: await getBuffer(data2),
	    caption: `${data.result.data.pixeldrain_dl[2].size}\n*🎬 MOVIEDL 🎬*`,
            mimetype: "video/mp4",
            fileName: `${data.result.data.title}.mp4`,
        };


	    
        await conn.sendMessage(from, message );

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (error) {
        console.error('Error fetching or sending', error);
        await conn.sendMessage(from, '*Error fetching or sending *', { quoted: mek });
    }
});
    category: "movie",
    react: "🍿",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const link = q.trim();
        
        const result = await SinhalaSub.movie(link);
        if (!result.status) return reply("Movie details not found.");

        const movie = result.result;
        let msg = `*${movie.title}*\n\n`;
        msg += `Release Date: ${movie.release_date}\n`;
        msg += `Country: ${movie.country}\n\n`;
        msg += `Duration: ${movie.duration}\n\n`;
        msg += `Genres: ${movie.genres}\n\n`;
        msg += `IMDb Rating: ${movie.IMDb_Rating}\n`;
        msg += `Director: ${movie.director.name}\n\n`;
        msg += `Select The Number For Download Movie\n\n`;
        msg += "Available formats:\n 1. 𝗦𝗗 𝟰𝟴𝟬\n 2. 𝗛𝗗 𝟳𝟮𝟬\n 3. 𝗙𝗛𝗗 𝟭𝟬𝟴𝟬\n\n";
        msg += "Use `.mv <Quality Number> <movie_link>` to download.\n\n";
        msg += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`;

         const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

        await conn.sendMessage(from, {image: {url: imageUrl},caption: msg }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply('*Error !!*');
    }
});

// Command to handle downloading the movie in specified format without buttons
cmd({
    pattern: "mv",
    react: "🎬",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const [format, url] = q.split(' ');
        const result = await SinhalaSub.movie(url);
        const movie = result.result;

        let quality;
        if (format === '1') {
            quality = "SD 480p";
        } else if (format === '2') {
            quality = "HD 720p";
        } else if (format === '3') {
            quality = "FHD 1080p";
        } else {
            return reply("Invalid format. Please choose from 1, 2, or 3.");
        }

        const directLink = await PixaldrainDL(url, quality, "direct");
        if (directLink) {
            await conn.sendMessage(from, {
                document: { url: directLink },
                mimetype: 'video/mp4',
                fileName: `${movie.title}.mp4`,
                caption: "> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®"
            }, { quoted: mek });
        } else {
            reply(`Could not find the ${format}p download link. Please check the URL or try a different movie.`);
        }
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message} ❌`);
    }
});

// Command to get recently added movies without buttons
cmd({
    pattern: "searchmovies",
    alias: ["smv"],
    desc: "Get recently added movies.",
    category: "movie",
    react: "🆕",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const page = 1;
        const result = await SinhalaSub.get_list.by_recent_movies(page);
        if (!result.status || result.results.length === 0) return reply("No recent movies found.");

        let message = "*Recently Added Movies:*\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nLink: ${item.link}\n\n`;
        });

        message += "> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®";

        await conn.sendMessage(from, { text: message }, { quoted: mek });
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`Error: ${e.message}`);
    }
});
