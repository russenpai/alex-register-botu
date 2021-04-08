const { MessageEmbed } = require("discord.js");
const ayar = require("../crenlog.json");
const db = require("quick.db");
exports.run = async(client, message, args) => {
    let embed = new MessageEmbed().setColor('DARK').setTimestamp().setFooter(`Rusyalı was here!`)
    if (!message.member.roles.cache.has(ayar.kayıtcıRolü) && !message.member.hasPermission(8)) return message.channel.send(embed.setDescription(`${message.author}, Bu komutu kullanmak için gerekli yetkiye sahip değilsin.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    let data = await db.get("teyit") || []
    if (!data) return message.channel.send(embed.setDescription(`Sunucuya ait kayıt verisi bulunamadı.`))

    let x = Object.keys(data)
        //let listed = x.filter(data => message.guild.members.cache.has(data)).sort((a, b) => Number((data[b].erkek || 0) + (data[b].kız || 0) - )) - Number((data[a].erkek || 0) + (data[a].kız || 0) ).map((value, index) => ))
    let topteyit = x.filter(dat => message.guild.members.cache.has(dat)).sort((a, b) => Number((data[b].erkek || 0) + (data[b].kız || 0)) - Number((data[a].erkek || 0) + (data[a].kız || 0))).map((value, index) => `\`${index + 1}.\` ${message.guild.members.cache.get(value)} Toplam **${((data[value].erkek || 0) + (data[value].kız || 0))}** (**${((data[value].erkek || 0))}** Erkek **${((data[value].kız || 0))}** kız)`).splice(0, 25);
    message.channel.send(embed.setDescription(topteyit || 'Sunucuya ait kayıt verisi bulunamadı.'))
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['tt'],
    name: 'topteyit',
    permLevel: 0
};