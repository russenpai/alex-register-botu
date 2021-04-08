const { MessageEmbed } = require("discord.js");
const ayar = require("../crenlog.json");
const db = require("quick.db");
exports.run = async(client, message, args) => {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let embed = new MessageEmbed().setColor('DARK').setTimestamp().setFooter(`Rusyalı was here!`)
    if (!message.member.roles.cache.has(ayar.kayıtcıRolü) && !message.member.hasPermission(8)) return message.channel.send(embed.setDescription(`${message.author}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    if (!member) return message.channel.send(embed.setDescription(`${message.author}, Bir üye belirt.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(embed.setDescription(`${message.author}, Bu kullanıcı senden üst/aynı pozisyonda.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    if (member.id === client.user.id) return message.channel.send(embed.setDescription(`${message.author}, Beni kayıt edemezsin.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    if (member.id === message.author.id) return message.channel.send(embed.setDescription(`${message.author}, Kendini kayıt edemezsin.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    member.roles.set([ayar.kayıtsızRolü]).catch()
    member.setNickname(`${ayar.unTag} İsim | Yaş`)
    message.channel.send(embed.setDescription(`
${member} Adlı kullanıcıya ${message.author} tarafından ${message.guild.roles.cache.get(ayar.kayıtsızRolü)} rolü verildi.
`))
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["unregister"],
    name: 'kayıtsız',
    permLevel: 0
};