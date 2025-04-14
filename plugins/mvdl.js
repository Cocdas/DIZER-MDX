const { cmd } = require('../command');
const { fetchJson, getBuffer } = require('../lib/functions');

cmd({
    pattern: "moviedl1",
    react: "📥",
    description: "Movie downloader",
    use: ".movie kgf",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {

    if (!q) return reply('*Please provide a movie name!*');

    try {
        const searchRes = await fetchJson(`https://vajira-api.vercel.app/movie/sinhalasub/search?text=${q}`);
        if (!searchRes?.result?.data?.length) return reply('❌ Movie not found.');

        const moviePageUrl = searchRes.result.data[0].link;

        const movieData = await fetchJson(`https://vajira-api.vercel.app/movie/sinhalasub/movie?url=${moviePageUrl}`);
        const movie = movieData?.result?.data;

        if (!movie?.pixeldrain_dl?.[2]?.link) return reply('❌ No downloadable link found.');

        const downloadLink = movie.pixeldrain_dl[2].link;

        const caption = `
🎬 *Title:* ${movie.title}
📅 *Date:* ${movie.date}
🌍 *Country:* ${movie.country}

*💗 Powered by DIZER BOT*
        `.trim();

        await conn.sendMessage(from, {
            image: { url: movie.image },
            caption
        }, { quoted: mek });

        const message = {
            document: await getBuffer(downloadLink),
            mimetype: "video/mp4",
            fileName: `${movie.title}.mp4`,
            caption: `${movie.pixeldrain_dl[2].size}\n🎬 *MOVIEDL* 🎬`
        };

        await conn.sendMessage(from, message, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error('❌ Error:', error);
        await reply('⚠️ Failed to download movie. Please try again.');
    }
});
