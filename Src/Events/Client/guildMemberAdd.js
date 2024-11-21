const { EmbedBuilder } = require('discord.js')
const Event = require('../../Structures/Event')

module.exports = class GuildMemberAdd extends Event {
   constructor(client) {
      super(client, 'guildMemberAdd')
   }

   async run(member) {
      return

      const channel = member.guild.channels.cache.get('753275189084553276')
      if (!channel) return

      const embed = new EmbedBuilder().setColor(this.config.embed.color).setDescription(`✦ <@${member.user.id}> has joined the server.`)

      channel.send({ embeds: [embed] })
   }
}
