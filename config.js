const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;

}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "V54wgRaL#QJg8CqP1Nx5ixBz3wnDu5b7qC_75mK3SdZ4LZ0433FQ",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/otfl6o.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "HEY SIR/MAM ANGEL MD IS AVAILABLE FOR YOUR HELP",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
MODE: process.env.MODE || "public",
ALWAYS_ONLINE : process.env.ALWAYS_ONLINE || "false",
AUTO_TYPING: process.env.AUTO_TYPING || "false",
AUTO_RECORDING: process.env.AUTO_RECORDING || "true",
BLOCK_JID: process.env.BLOCK_JID || "", //block jids    
 
};
