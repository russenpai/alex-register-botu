const Discord = require("discord.js");
exports.run = async (client, message, args) => {       
//Rusyalı was here! 
let Tag = "ᶜˢ" //Sunucu Tagınız
let ServerName = "CrenShaw #Ekip" // Sunucu Adını Giriniz
let BoosterRole =  "796545986939584512" // Booster Rol ID
//Rusyalı was here! 
          var TotalMember = message.guild.memberCount
          var Online = message.guild.members.cache.filter(off => off.presence.status !== 'offline').size;
          var Taglı = message.guild.members.cache.filter(u => u.user.username.includes(Tag)).size;
          var Voice = message.guild.members.cache.filter(s => s.voice.channel).size;
          var Boost = message.guild.premiumSubscriptionCount;
          const rusyaliembed = new Discord.MessageEmbed()
              .setColor('#2F3136')
              .setAuthor(`${message.guild.name}`,message.guild.iconURL())
              .setDescription(`
\`•\` Sunucumuzda ${client.emojili(`${TotalMember}`)} **toplam** kullanıcı bulunmaktadır.
\`•\` Sunucumuzda ${client.emojili(`${Online}`)} **aktif** kullanıcı bulunmaktadır.
\`•\` Sunucumuzda ${client.emojili(`${Taglı}`)} **taglı** kullanıcı bulunmaktadır.
\`•\` Sunucumuzda **sesli odalarda** ${client.emojili(`${Voice}`)} kullanıcı bulunmaktadır.
\`•\` Sunucuda ${client.emojili(`${Boost}`)} **takviye** bulunmaktadır.
`)
message.channel.send(rusyaliembed)

}
exports.conf = {enabled: true, guildOnly: true, aliases: ["say", "s"]};
exports.help = {name: 'say'};
