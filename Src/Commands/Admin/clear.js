const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Clear extends Command {
   constructor(client) {
      super(client)
      this.isAdmin = true
      this.data = new SlashCommandBuilder().setName('clear').setDescription('✦ Clear player messages in all guilds')
   }

   async run(interaction, embed) {
      this.removeMessage(await interaction.editReply({ embeds: [embed.setDescription('✦ Meowing')] }), 5000)

      const guilds = this.client.guilds.cache

      for (const guild of guilds.values()) {
         await this.clearPlayerMessages(guild)
      }
   }

   async clearPlayerMessages(guild) {
      const textChannels = guild.channels.cache.filter((channel) => channel.type === 0)
      if (textChannels.size === 0) return

      for (const channel of textChannels.values()) {
         await this.clear(channel)
      }
   }

   async clear(channel) {
      try {
         const messages = await channel.messages.fetch({ limit: 50 })
         if (messages.size === 0) return

         const messagesToDelete = messages.filter((message) => this.shouldDelete(message))
         await Promise.all(messagesToDelete.map((message) => message.delete()))
      } catch (error) {}
   }

   shouldDelete(message) {
      const { author, embeds } = message
      return (
         (author.tag === 'DISBOARD#2760' && message.guild.id === this.config.guild.id) ||
         (author.tag === 'Raiden Shogun#9673' && embeds.length > 0 && embeds[0].author?.name.includes('🪐'))
      )
   }
}
