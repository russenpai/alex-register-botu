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

    let taglıalım = await db.get(`taglıalım.${message.guild.id}`)
    if (taglıalım) {
        if (!member.user.username.includes(ayar.tag) && !member.roles.cache.has(ayar.boosterRolü) && !member.roles.cache.has(ayar.vipRolü)) {
            return message.channel.send(embed.setDescription(`${member} Adlı kullanıcının isminde tag bulunmadığı için kayıt işlemi gerçekleştirilemedi.`))
        }
    }

    args = args.filter(a => a !== "" && a !== " ").splice(1)
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    let fixTag = `${member.user.username.includes(ayar.tag) ? ayar.tag : ayar.unTag}`
    if (!isim) return message.channel.send(embed.setDescription(`${message.author}, Geçerli bir isim ve yaş belirtmelisin.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
    var name;
    if (yaş) name = `${fixTag} ${isim} | ${yaş}`
    if (!yaş) name = `${fixTag} ${isim}`

    member.setNickname(name)

    message.channel.send(embed.setDescription(`${member} Adlı kullanıcının ismi "${name}" olarak güncellendi.`)).then(async msg => {
        await msg.react(ayar.erkekEmoji)
        await msg.react(ayar.kızEmoji)
        await msg.react("❌")

        const erkekemoji = (reaction, user) => reaction.emoji.name === ayar.erkekEmoji && user.id === message.author.id;
        const kadinemoji = (reaction, user) => reaction.emoji.name === ayar.kızEmoji && user.id === message.author.id;
        const isimemoji = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id;


        let erkek = msg.createReactionCollector(erkekemoji, { time: 20000, max: 1 })
        let kız = msg.createReactionCollector(kadinemoji, { time: 20000, max: 1 })
        let isimxd = msg.createReactionCollector(isimemoji, { time: 20000, max: 1 })

        erkek.on("collect", async() => {
            await msg.reactions.removeAll()
            if (member.roles.cache.has(ayar.vipRolü) ? await member.roles.set(ayar.erkekRolleri) && member.roles.add(ayar.vipRolü) : member.roles.set(ayar.erkekRolleri))
                if (member.user.username.includes(ayar.tag)) member.roles.add(ayar.familyRolü)
            await msg.edit(embed.setDescription(`${member} Adlı kullanıcıya ${message.guild.roles.cache.get(ayar.erkek1)} rolü verildi.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
            db.push(`isimler.${member.id}`, { Name: name, Sex: `(<@&${ayar.erkek1}>)`, })
            db.add(`teyit.${message.author.id}.erkek`, 1)
            db.add(`teyit.${message.author.id}.toplam`, 1)
        })

        kız.on("collect", async() => {
            await msg.reactions.removeAll()
            if (member.roles.cache.has(ayar.vipRolü) ? await member.roles.set(ayar.kızRolleri) && member.roles.add(ayar.vipRolü) : member.roles.set(ayar.kızRolleri))
                if (member.user.username.includes(ayar.tag)) member.roles.add(ayar.familyRolü)

            await msg.edit(embed.setDescription(`${member} Adlı kullanıcıya ${message.guild.roles.cache.get(ayar.kız1)} rolü verildi.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
            db.push(`isimler.${member.id}`, { Name: name, Sex: `(<@&${ayar.kız1}>)`, })
            db.add(`teyit.${message.author.id}.kız`, 1)
            db.add(`teyit.${message.author.id}.toplam`, 1)
        })

        isimxd.on("collect", async() => {
            await msg.reactions.removeAll()

            await msg.delete({ timeout: 5000 })
            db.push(`isimler.${member.id}`, { Name: name, Sex: `(İsim değiştirme)`, })
        })

    })

}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["k", "isim"],
    name: 'kayıt',
    permLevel: 0
};