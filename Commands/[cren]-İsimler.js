const { MessageEmbed } = require("discord.js");
const ayar = require("../crenlog.json");
const db = require("quick.db");
exports.run = async(client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let embed = new MessageEmbed().setColor('DARK').setTimestamp().setFooter(`Rusyalı was here!`)
    if (!message.member.roles.cache.has(ayar.kayıtcıRolü) && !message.member.hasPermission(8)) return message.channel.send(embed.setDescription(`${message.author}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    if (!member) return message.channel.send(embed.setDescription(`${message.author}, Bir üye belirt.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    let data = await db.get(`isimler.${member.id}`)
    if (!data) return message.channel.send(embed.setDescription(`${member} Adlı kullanıcının geçmiş isimleri bulunamadı.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 6999 }))
    let isimler = data.map((value, index) => `\`${value.Name}\` ${value.Sex}`).splice(0, 20)


    message.channel.send(embed.setDescription(`
Bu kullanıcının toplam **${data.length > 20 ? "20" : data.length}** isim kayıtı bulundu.

    ${isimler.join("\n")}
    `)).then(m => m.delete({ timeout: 10000 }) && message.delete({ timeout: 9999 }))

}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    name: 'isimler',
    permLevel: 0
};