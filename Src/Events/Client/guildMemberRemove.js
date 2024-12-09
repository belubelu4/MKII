const { EmbedBuilder } = require('discord.js')
const Event = require('../../Structures/Event')

module.exports = class GuildMemberRemove extends Event {
   constructor(client) {
      super(client, 'guildMemberRemove')
   }

   async run(member) {
      return

      const channel = member.guild.channels.cache.get('753275189084553276')
      if (!channel) return

      const embed = new EmbedBuilder().setColor(this.config.embed.color).setDescription(`✦ ${member.user.tag} cook`)

      channel.send({ embeds: [embed] })
   }
}
