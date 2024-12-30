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

const data0 = await fetchJson(`https://vajira-api.vercel.app/movie/sinhalasub/search?text=${q}`);   

const data1 = data0.result.data[0].link
console.log(data1)

const data = await fetchJson(`https://vajira-api.vercel.app/movie/sinhalasub/movie?url=${data1}`);   	    
const data2 = data.result.data.pixeldrain_dl[2].link
console.log(data2)
    
const cap = `        
Title : ${data.result.data.title}
Date : ${data.result.data.date}
Country : ${data.result.data.country}
> *💗𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - : ANGEL 🧚‍*
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
