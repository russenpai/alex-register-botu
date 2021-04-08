const Discord = require('discord.js');
const client = new Discord.Client();
const chalk = require('chalk');
const config = require("./crenlog.json")
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const snekfetch = require('snekfetch');
const { inflateRaw } = require('zlib');
const message = require('./events/message');
const app = express();


var prefix = config.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./Commands/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./Commands/${f}`);
        log(`Yüklenen komut: ${props.conf.name}.`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.conf.name);
        });
    });
});

fs.readdir("./events", (err, files) => {
    if (err) return console.error(err);
    files.filter(file => file.endsWith(".js")).forEach(file => {
        let prop = require(`./events/${file}`);
        if (!prop.configuration) return;
        client.on(prop.configuration.name, prop);
    });
});


client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./Commands/${command}`)];
            let cmd = require(`./Commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.conf.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./Commands/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./Commands/${command}`)];
            let cmd = require(`./Commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === config.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(config.token);


//////// emoji sistemi başlangıç
//Bunu başka komutlarınızda da kullanabilirsiniz örnek alarak.
const emojiler = {
   0: "", // Emoji ID 0 (Emoji idleri girmez iseniz say komudu çalışmaz)
   1: "", // Emoji ID 1
   2: "", // Emoji ID 2
   3: "", // Emoji ID 3
   4: "", // Emoji ID 4
   5: "", // Emoji ID 5
   6: "", // Emoji ID 6
   7: "", // Emoji ID 7
   8: "", // Emoji ID 8
   9: ""} // Emoji ID 9
  client.emojili = (string) => {
    let arx = "";
    String(string).split("").forEach(x => {
      arx += "" + emojiler[Number(x)];
    });
    return arx;
  };
    client.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

//////// emoji sistemi son

//////////////////////////////////////////////////////////////////////// 

//////// Tag alıp verme başlangıç
client.on("userUpdate", async(oldUser, newUser) => {
    if (oldUser.username !== newUser.username) {
        let tag = config.tag //Sunucu tagınız (crenlog.json id girin)
        let sunucu = config.guildID //sunucu ID (crenlog.json id girin)
        let kanal = config.registerChat //log kanal id (crenlog.json id girin)
        let rol = config.familyRolü //tag alınca verilcek rol id (crenlog.json id girin)
        if (newUser.username.includes(tag) && !client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.cache.has(rol)) {
            client.channels.cache.get(kanal).send(new Discord.MessageEmbed().setDescription(`${newUser} **\`${tag}\`** tagını aldığı için <@&${rol}> rolünü kazandı!`).setColor('RANDOM').setFooter('Rusyalı was here.'))
            client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.add(rol)
        }
        if (!newUser.username.includes(tag) && client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.cache.has(rol)) {
            client.guilds.cache.get(sunucu).members.cache.get(newUser.id).roles.remove(rol)
            client.channels.cache.get(kanal).send(new Discord.MessageEmbed().setDescription(`${newUser} **\`${tag}\`** tagını çıkardığı için <@&${rol}> rolünü aldım!`).setColor('RANDOM').setFooter('Rusyalı was here.'))
        }

    }
})
//////// Tag alıp verme son

client.on("guildMemberRemove", async(member) => {
    await db.push(`isimler.${member.id}`, { Name: member.displayName, Sex: `(Sunucudan ayrılma)` })
})