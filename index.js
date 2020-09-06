const express = require('express');
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT); // Recebe solicitações que o deixa online

const Discord = require("discord.js"); //Conexão com a livraria Discord.js
const client = new Discord.Client(); //Criação de um novo Client
const config = require("./config.json"); //Pegando o prefixo do bot para respostas de comandos


// evento de despedida servidor cafeteria:

client.on("guildMemberRemove", async (member) => { 

  let guild = await client.guilds.cache.get("733863712036749323");
  let channel = await client.channels.cache.get("733882007775609006");
  let emoji = await member.guild.emojis.cache.find(emoji => emoji.name === "e_oof");
  if (guild != member.guild) {
    return console.log("Algum saco pela saiu do servidor. Mas não é nesse, então tá tudo bem :)");
   } else {
      let embed = await new Discord.MessageEmbed()
      .setColor("#7c2ae8")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`${emoji} Adeus! ${emoji}`)
      .setImage("https://media.tenor.com/images/0e0dbc86dfdba8907a307d5a54be81f1/tenor.gif")
      .setDescription(`**${member.user.username}**, saiu do servidor! :broken_heart:`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
      .setFooter("Bily and Dark22")
      .setTimestamp();

    channel.send(embed);
  }
});

client.on("ready", () => {
  let activities = [
      `Utilize ${config.prefix}help para obter ajuda`,
      `${client.guilds.cache.size} servidores!`,
      `${client.channels.cache.size} canais!`,
      `${client.users.cache.size} usuários!`
    ],
    i = 0;
  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "WATCHING" // PLAYING, WATCHING, LISTENING, STREAMING
      }), 1000 * 60); 
  client.user
      .setStatus("online") // idle, dnd, online, invisible
      .catch(console.error);
console.log(`Estou online, em ${client.guilds.cache.size} servidores, ${client.channels.cache.size} canais e ${client.users.cache.size} usuários!`)
});

client.on('message', message => {
  if(message.channel.type === 'dm' || message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(config.prefix)) return;
  if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

 const args = message.content
     .trim().slice(config.prefix.length)
     .split(/ +/g);
 const command = args.shift().toLowerCase();

 try {
     const commandFile = require(`./commands/${command}.js`)
     commandFile.run(client, message, args);
 } catch (err) {
 console.error('Erro:' + err);
}
});

client.login(process.env.TOKEN); //Ligando o Bot caso ele consiga acessar o token