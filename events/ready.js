const chalk = require("chalk");
const moment = require("moment");
const Discord = require("discord.js");
const config = require("../crenlog.json");

var prefix = config.prefix;

module.exports = client => {

    console.log(`

${client.user.username} İsmi ile giriş yapıldı.`)
    client.user.setStatus("dnd");


    client.user.setActivity(`Rusyalı was here!`);
  
    let kanal = client.channels.cache.get(config.botVoice)
    if (kanal) {
        kanal.join()
    } else {
        console.log('kanala bağlanamadım.')
    }
};


