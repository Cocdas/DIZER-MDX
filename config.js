const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "4pRSmDhK#trXCYK9Cb1PwwMnZfbyyvC9mglHW6Dmlhs1p-ZT39NQ",
AUTO_READ_CMD: process.env.AUTO_READ_CMD || "true",
MODE: process.env.MODE || "private",
};
